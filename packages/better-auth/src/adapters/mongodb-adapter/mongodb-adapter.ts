import { ObjectId, type Db } from "mongodb";
import { getAuthTables } from "../../db";
import type { Adapter, BetterAuthOptions, Where } from "../../types";
import { withApplyDefault } from "../utils";
import { symmetricEncrypt, symmetricDecrypt } from "../../crypto";

const createTransform = (options: BetterAuthOptions) => {
	const schema = getAuthTables(options);
	/**
	 * if custom id gen is provided we don't want to override with object id
	 */
	const customIdGen = options.advanced?.generateId;

	// Fields that should not be encrypted
	const nonEncryptedFields = ['id', '_id', 'createdAt', 'updatedAt'];

	async function encryptValue(value: any): Promise<string> {
		if (value === null || value === undefined) return value;
		if (typeof value === 'object') {
			return await symmetricEncrypt({
				key: options.secret || '',
				data: JSON.stringify(value)
			});
		}
		return await symmetricEncrypt({
			key: options.secret || '',
			data: String(value)
		});
	}

	async function decryptValue(value: string): Promise<any> {
		if (!value) return value;
		const decrypted = await symmetricDecrypt({
			key: options.secret || '',
			data: value
		});
		try {
			return JSON.parse(decrypted);
		} catch {
			return decrypted;
		}
	}

	function serializeID(field: string, value: any, model: string) {
		if (customIdGen) {
			return value;
		}
		if (
			field === "id" ||
			field === "_id" ||
			schema[model].fields[field].references?.field === "id"
		) {
			if (typeof value !== "string") {
				if (value instanceof ObjectId) {
					return value;
				}
				if (Array.isArray(value)) {
					return value.map((v) => {
						if (typeof v === "string") {
							try {
								return new ObjectId(v);
							} catch (e) {
								return v;
							}
						}
						if (v instanceof ObjectId) {
							return v;
						}
						throw new Error("Invalid id value");
					});
				}
				throw new Error("Invalid id value");
			}
			try {
				return new ObjectId(value);
			} catch (e) {
				return value;
			}
		}
		return value;
	}

	function deserializeID(field: string, value: any, model: string) {
		if (customIdGen) {
			return value;
		}
		if (
			field === "id" ||
			schema[model].fields[field].references?.field === "id"
		) {
			if (value instanceof ObjectId) {
				return value.toHexString();
			}
			if (Array.isArray(value)) {
				return value.map((v) => {
					if (v instanceof ObjectId) {
						return v.toHexString();
					}
					return v;
				});
			}
			return value;
		}
		return value;
	}

	function getField(field: string, model: string) {
		if (field === "id") {
			if (customIdGen) {
				return "id";
			}
			return "_id";
		}
		const f = schema[model].fields[field];
		return f.fieldName || field;
	}

	return {
		async transformInput(
			data: Record<string, any>,
			model: string,
			action: "create" | "update",
		) {
			const transformedData: Record<string, any> =
				action === "update"
					? {}
					: customIdGen
						? {
								id: customIdGen({ model }),
							}
						: {
								_id: new ObjectId(),
							};
			const fields = schema[model].fields;
			for (const field in fields) {
				const value = data[field];
				if (
					value === undefined &&
					(!fields[field].defaultValue || action === "update")
				) {
					continue;
				}
				const serializedValue = serializeID(field, value, model);
				const fieldName = fields[field].fieldName || field;
				
				// Only encrypt non-sensitive fields
				if (!nonEncryptedFields.includes(fieldName)) {
					transformedData[fieldName] = await encryptValue(serializedValue);
				} else {
					transformedData[fieldName] = withApplyDefault(
						serializedValue,
						fields[field],
						action,
					);
				}
			}
			return transformedData;
		},
		async transformOutput(
			data: Record<string, any>,
			model: string,
			select: string[] = [],
		) {
			const transformedData: Record<string, any> =
				data.id || data._id
					? select.length === 0 || select.includes("id")
						? {
								id: data.id ? data.id.toString() : data._id.toString(),
							}
						: {}
					: {};

			const tableSchema = schema[model].fields;
			for (const key in tableSchema) {
				if (select.length && !select.includes(key)) {
					continue;
				}
				const field = tableSchema[key];
				if (field) {
					const fieldName = field.fieldName || key;
					const value = data[fieldName];
					
					// Only decrypt non-sensitive fields
					if (!nonEncryptedFields.includes(fieldName)) {
						transformedData[key] = await decryptValue(value);
					} else {
						transformedData[key] = deserializeID(key, value, model);
					}
				}
			}
			return transformedData as any;
		},
		async convertWhereClause(where: Where[], model: string) {
			if (!where.length) return {};
			const conditions = await Promise.all(where.map(async (w) => {
				const { field: _field, value, operator = "eq", connector = "AND" } = w;
				let condition: any;
				const field = getField(_field, model);
				
				// Don't encrypt conditions for non-sensitive fields
				if (nonEncryptedFields.includes(field)) {
					switch (operator.toLowerCase()) {
						case "eq":
							condition = {
								[field]: serializeID(_field, value, model),
							};
							break;
						case "in":
							condition = {
								[field]: {
									$in: Array.isArray(value)
										? serializeID(_field, value, model)
										: [serializeID(_field, value, model)],
								},
							};
							break;
						case "gt":
							condition = { [field]: { $gt: value } };
							break;
						case "gte":
							condition = { [field]: { $gte: value } };
							break;
						case "lt":
							condition = { [field]: { $lt: value } };
							break;
						case "lte":
							condition = { [field]: { $lte: value } };
							break;
						case "ne":
							condition = { [field]: { $ne: value } };
							break;
						default:
							throw new Error(`Unsupported operator: ${operator}`);
					}
				} else {
					// For encrypted fields, we can only do exact matches
					if (operator.toLowerCase() !== "eq") {
						throw new Error(`Only exact matches are supported for encrypted fields`);
					}
					condition = {
						[field]: await encryptValue(value)
					};
				}
				return { condition, connector };
			}));
			if (conditions.length === 1) {
				return conditions[0].condition;
			}
			const andConditions = conditions
				.filter((c) => c.connector === "AND")
				.map((c) => c.condition);
			const orConditions = conditions
				.filter((c) => c.connector === "OR")
				.map((c) => c.condition);

			let clause = {};
			if (andConditions.length) {
				clause = { ...clause, $and: andConditions };
			}
			if (orConditions.length) {
				clause = { ...clause, $or: orConditions };
			}
			return clause;
		},
		getModelName: (model: string) => {
			return schema[model].modelName;
		},
		getField,
	};
};

export const mongodbAdapter = (db: Db) => (options: BetterAuthOptions) => {
	const transform = createTransform(options);
	const hasCustomId = options.advanced?.generateId;
	return {
		id: "mongodb-adapter",
		async create(data) {
			const { model, data: values, select } = data;
			const transformedData = await transform.transformInput(values, model, "create");
			if (transformedData.id && !hasCustomId) {
				// biome-ignore lint/performance/noDelete: setting id to undefined will cause the id to be null in the database which is not what we want
				delete transformedData.id;
			}
			const res = await db
				.collection(transform.getModelName(model))
				.insertOne(transformedData);
			const id = res.insertedId;
			const insertedData = { id: id.toString(), ...transformedData };
			const t = await transform.transformOutput(insertedData, model, select);
			return t;
		},
		async findOne(data) {
			const { model, where, select } = data;
			const clause = await transform.convertWhereClause(where, model);
			const res = await db
				.collection(transform.getModelName(model))
				.findOne(clause);
			if (!res) return null;
			const transformedData = await transform.transformOutput(res, model, select);
			return transformedData;
		},
		async findMany<T>(data: {
			model: string
			where?: Where[]
			limit?: number
			offset?: number
			sortBy?: { field: string; direction: "asc" | "desc" }
		}): Promise<T[]> {
			const { model, where, limit, offset, sortBy } = data
			const clause = where ? await transform.convertWhereClause(where, model) : {}
			const cursor = db.collection(transform.getModelName(model)).find(clause)
			if (limit) cursor.limit(limit)
			if (offset) cursor.skip(offset)
			if (sortBy)
				cursor.sort(
					transform.getField(sortBy.field, model),
					sortBy.direction === "desc" ? -1 : 1,
				)
			const res = await cursor.toArray()
			const transformedResults = await Promise.all(
				res.map((r) => transform.transformOutput(r, model))
			)
			return transformedResults as T[]
		},
		async count(data) {
			const { model } = data;
			const res = await db
				.collection(transform.getModelName(model))
				.countDocuments();
			return res;
		},
		async update(data) {
			const { model, where, update: values } = data;
			const clause = await transform.convertWhereClause(where, model);

			const transformedData = await transform.transformInput(values, model, "update");

			const res = await db
				.collection(transform.getModelName(model))
				.findOneAndUpdate(
					clause,
					{ $set: transformedData },
					{
						returnDocument: "after",
					},
				);
			if (!res) return null;
			return transform.transformOutput(res, model);
		},
		async updateMany(data) {
			const { model, where, update: values } = data;
			const clause = await transform.convertWhereClause(where, model);
			const transformedData = await transform.transformInput(values, model, "update");
			const res = await db
				.collection(transform.getModelName(model))
				.updateMany(clause, { $set: transformedData });
			return res.modifiedCount;
		},
		async delete(data) {
			const { model, where } = data;
			const clause = await transform.convertWhereClause(where, model);
			const res = await db
				.collection(transform.getModelName(model))
				.findOneAndDelete(clause);
			if (!res) return null;
			return transform.transformOutput(res, model);
		},
		async deleteMany(data) {
			const { model, where } = data;
			const clause = await transform.convertWhereClause(where, model);
			const res = await db
				.collection(transform.getModelName(model))
				.deleteMany(clause);
			return res.deletedCount;
		},
	} satisfies Adapter;
};
