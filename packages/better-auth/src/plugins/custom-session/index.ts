import { z } from "zod";
import { createAuthEndpoint, getSessionFromCtx } from "../../api";
import type {
	AuthContext,
	BetterAuthOptions,
	BetterAuthPlugin,
	InferSession,
	InferUser,
} from "../../types";

export const customSession = <
	Returns extends Record<string, any>,
	O extends BetterAuthOptions = BetterAuthOptions,
>(
	fn: (session: {
		user: InferUser<O>;
		session: InferSession<O>;
	}, ctx: AuthContext, query?: { sessionOnly?: boolean; disableCookieCache?: boolean; disableRefresh?: boolean }) => Promise<Returns>,
	options?: O,
) => {
	return {
		id: "custom-session",
		endpoints: {
			getSession: createAuthEndpoint(
				"/get-session",
				{
					method: "GET",
					metadata: {
						CUSTOM_SESSION: true,
					},
					query: z.optional(
						z.object({
							/**
							 * If cookie cache is enabled, it will disable the cache
							 * and fetch the session from the database
							 */
							disableCookieCache: z
								.boolean({
									description:
										"Disable cookie cache and fetch session from database",
								})
								.or(z.string().transform((v) => v === "true"))
								.optional(),
							disableRefresh: z
								.boolean({
									description:
										"Disable session refresh. Useful for checking session status, without updating the session",
								})
								.optional(),
							sessionOnly: z
								.boolean({
									description:
										"Return only session data without custom enrichment",
								})
								.or(z.string().transform((v) => v === "true"))
								.optional(),
						}),
					),
				},
				async (ctx) => {
					const session = await getSessionFromCtx(ctx);
					if (!session) {
						return ctx.json(null);
					}
					const fnResult = await fn(session as any, ctx.context, ctx.query);
					return ctx.json(fnResult);
				},
			),
		},
	} satisfies BetterAuthPlugin;
};
