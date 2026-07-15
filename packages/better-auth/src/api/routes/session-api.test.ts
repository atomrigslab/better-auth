import { describe, expect, it, vi } from "vitest";
import { getTestInstance } from "../../test-utils/test-instance";
import { parseSetCookieHeader } from "../../cookies";
import { getDate } from "../../utils/date";
import { memoryAdapter, type MemoryDB } from "../../adapters/memory-adapter";

describe("session", async () => {
	const { client, testUser, sessionSetter, cookieSetter, auth } =
		await getTestInstance();

	it("should set cookies correctly on sign in", async () => {
		const headers = new Headers();
		await client.signIn.email(
			{
				email: testUser.email,
				password: testUser.password,
			},
			{
				onSuccess(context) {
					const header = context.response.headers.get("set-cookie");
					const cookies = parseSetCookieHeader(header || "");
					cookieSetter(headers)(context);
					const cookie = cookies.get("better-auth.session_token");
					expect(cookie).toMatchObject({
						value: expect.any(String),
						"max-age": 60 * 60 * 24 * 7,
						path: "/",
						samesite: "lax",
						httponly: true,
					});
				},
			},
		);
		const { data } = await client.getSession({
			fetchOptions: {
				headers,
			},
		});
		const expiresAt = new Date(data?.session.expiresAt || "");
		const now = new Date();

		expect(expiresAt.getTime()).toBeGreaterThan(
			now.getTime() + 6 * 24 * 60 * 60 * 1000,
		);
	});

	it("should return null when not authenticated", async () => {
		const response = await client.getSession();
		expect(response.data).toBeNull();
	});

	it("should update session when update age is reached", async () => {
		const { client, testUser } = await getTestInstance({
			session: {
				updateAge: 60,
				expiresIn: 60 * 2,
			},
		});
		let headers = new Headers();

		await client.signIn.email(
			{
				email: testUser.email,
				password: testUser.password,
			},
			{
				onSuccess(context) {
					const header = context.response.headers.get("set-cookie");
					const cookies = parseSetCookieHeader(header || "");
					const signedCookie = cookies.get("better-auth.session_token")?.value;
					headers.set("cookie", `better-auth.session_token=${signedCookie}`);
				},
			},
		);

		const data = await client.getSession({
			fetchOptions: {
				headers,
				throw: true,
			},
		});

		if (!data) {
			throw new Error("No session found");
		}
		expect(new Date(data?.session.expiresAt).getTime()).toBeGreaterThan(
			new Date(Date.now() + 1000 * 2 * 59).getTime(),
		);

		expect(new Date(data?.session.expiresAt).getTime()).toBeLessThan(
			new Date(Date.now() + 1000 * 2 * 60).getTime(),
		);
		for (const t of [60, 80, 100, 121]) {
			const span = new Date();
			span.setSeconds(span.getSeconds() + t);
			vi.setSystemTime(span);
			const response = await client.getSession({
				fetchOptions: {
					headers,
					onSuccess(context) {
						const parsed = parseSetCookieHeader(
							context.response.headers.get("set-cookie") || "",
						);
						const maxAge = parsed.get("better-auth.session_token")?.["max-age"];
						expect(maxAge).toBe(t === 121 ? 0 : 60 * 2);
					},
				},
			});
			if (t === 121) {
				//expired
				expect(response.data).toBeNull();
			} else {
				expect(
					new Date(response.data?.session.expiresAt!).getTime(),
				).toBeGreaterThan(new Date(Date.now() + 1000 * 2 * 59).getTime());
			}
		}
		vi.useRealTimers();
	});

	it("should update the session every time when set to 0", async () => {
		const { client, signInWithTestUser } = await getTestInstance({
			session: {
				updateAge: 0,
			},
		});
		const { headers } = await signInWithTestUser();

		const session = await client.getSession({
			fetchOptions: {
				headers,
			},
		});

		vi.useFakeTimers();
		await vi.advanceTimersByTimeAsync(1000 * 60 * 5);
		const session2 = await client.getSession({
			fetchOptions: {
				headers,
			},
		});
		expect(session2.data?.session.expiresAt).not.toBe(
			session.data?.session.expiresAt,
		);
		expect(
			new Date(session2.data!.session.expiresAt).getTime(),
		).toBeGreaterThan(new Date(session.data!.session.expiresAt).getTime());
	});

	it("should handle 'don't remember me' option", async () => {
		let headers = new Headers();
		const res = await client.signIn.email(
			{
				email: testUser.email,
				password: testUser.password,
				rememberMe: false,
			},
			{
				onSuccess(context) {
					const header = context.response.headers.get("set-cookie");
					const cookies = parseSetCookieHeader(header || "");
					const signedCookie = cookies.get("better-auth.session_token")?.value;
					const dontRememberMe = cookies.get(
						"better-auth.dont_remember",
					)?.value;
					headers.set(
						"cookie",
						`better-auth.session_token=${signedCookie};better-auth.dont_remember=${dontRememberMe}`,
					);
				},
			},
		);
		const data = await client.getSession({
			fetchOptions: {
				headers,
				throw: true,
			},
		});
		if (!data) {
			throw new Error("No session found");
		}
		const expiresAt = data.session.expiresAt;
		expect(new Date(expiresAt).valueOf()).toBeLessThanOrEqual(
			getDate(1000 * 60 * 60 * 24).valueOf(),
		);
		const response = await client.getSession({
			fetchOptions: {
				headers,
			},
		});

		if (!response.data?.session) {
			throw new Error("No session found");
		}
		// Check that the session wasn't update
		expect(
			new Date(response.data.session.expiresAt).valueOf(),
		).toBeLessThanOrEqual(getDate(1000 * 60 * 60 * 24).valueOf());
	});

	it("should set cookies correctly on sign in after changing config", async () => {
		const headers = new Headers();
		await client.signIn.email(
			{
				email: testUser.email,
				password: testUser.password,
			},
			{
				onSuccess(context) {
					const header = context.response.headers.get("set-cookie");
					const cookies = parseSetCookieHeader(header || "");
					expect(cookies.get("better-auth.session_token")).toMatchObject({
						value: expect.any(String),
						"max-age": 60 * 60 * 24 * 7,
						path: "/",
						httponly: true,
						samesite: "lax",
					});
					headers.set(
						"cookie",
						`better-auth.session_token=${
							cookies.get("better-auth.session_token")?.value
						}`,
					);
				},
			},
		);
		const data = await client.getSession({
			fetchOptions: {
				headers,
				throw: true,
			},
		});
		if (!data) {
			throw new Error("No session found");
		}
		const expiresAt = new Date(data?.session?.expiresAt || "");
		const now = new Date();

		expect(expiresAt.getTime()).toBeGreaterThan(
			now.getTime() + 6 * 24 * 60 * 60 * 1000,
		);
	});

	it("should clear session on sign out", async () => {
		let headers = new Headers();
		const res = await client.signIn.email(
			{
				email: testUser.email,
				password: testUser.password,
			},
			{
				onSuccess(context) {
					const header = context.response.headers.get("set-cookie");
					const cookies = parseSetCookieHeader(header || "");
					const signedCookie = cookies.get("better-auth.session_token")?.value;
					headers.set("cookie", `better-auth.session_token=${signedCookie}`);
				},
			},
		);
		const data = await client.getSession({
			fetchOptions: {
				headers,
				throw: true,
			},
		});

		expect(data).not.toBeNull();
		await client.signOut({
			fetchOptions: {
				headers,
			},
		});
		const response = await client.getSession({
			fetchOptions: {
				headers,
			},
		});
		expect(response.data);
	});

	it("should list sessions", async () => {
		const headers = new Headers();
		await client.signIn.email(
			{
				email: testUser.email,
				password: testUser.password,
			},
			{
				onSuccess: sessionSetter(headers),
			},
		);

		const response = await client.listSessions({
			fetchOptions: {
				headers,
			},
		});

		expect(response.data?.length).toBeGreaterThan(1);
	});

	it("should revoke session", async () => {
		const headers = new Headers();
		const headers2 = new Headers();
		const res = await client.signIn.email({
			email: testUser.email,
			password: testUser.password,
			fetchOptions: {
				onSuccess: sessionSetter(headers),
			},
		});
		await client.signIn.email({
			email: testUser.email,
			password: testUser.password,
			fetchOptions: {
				onSuccess: sessionSetter(headers2),
			},
		});
		const session = await client.getSession({
			fetchOptions: {
				headers,
				throw: true,
			},
		});
		await client.revokeSession({
			fetchOptions: {
				headers,
			},
			token: session?.session?.token || "",
		});
		const newSession = await client.getSession({
			fetchOptions: {
				headers,
			},
		});
		expect(newSession.data).toBeNull();
		const revokeRes = await client.revokeSessions({
			fetchOptions: {
				headers: headers2,
			},
		});
		expect(revokeRes.data?.status).toBe(true);
	});
});

describe("session storage", async () => {
	let store = new Map<string, string>();
	const { client, signInWithTestUser, db } = await getTestInstance({
		secondaryStorage: {
			set(key, value, ttl) {
				store.set(key, value);
			},
			get(key) {
				return store.get(key) || null;
			},
			delete(key) {
				store.delete(key);
			},
		},
		rateLimit: {
			enabled: false,
		},
	});

	it("should store session in secondary storage", async () => {
		//since the instance creates a session on init, we expect the store to have 2 item (1 for session and 1 for active sessions record for the user)
		expect(store.size).toBe(2);
		const { headers } = await signInWithTestUser();
		expect(store.size).toBe(3);
		const session = await client.getSession({
			fetchOptions: {
				headers,
			},
		});
		expect(session.data).toMatchObject({
			session: {
				userId: expect.any(String),
				token: expect.any(String),
				expiresAt: expect.any(Date),
				ipAddress: expect.any(String),
				userAgent: expect.any(String),
			},
			user: {
				id: expect.any(String),
				name: "test user",
				email: "test@test.com",
				emailVerified: false,
				image: null,
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			},
		});
	});

	it("should list sessions", async () => {
		const { headers } = await signInWithTestUser();
		const response = await client.listSessions({
			fetchOptions: {
				headers,
			},
		});
		expect(response.data?.length).toBeGreaterThan(1);
	});

	it("should revoke session", async () => {
		const { headers } = await signInWithTestUser();
		const session = await client.getSession({
			fetchOptions: {
				headers,
			},
		});
		expect(session.data).not.toBeNull();
		const res = await client.revokeSession({
			fetchOptions: {
				headers,
			},
			token: session.data?.session?.token || "",
		});
		const revokedSession = await client.getSession({
			fetchOptions: {
				headers,
			},
		});
		expect(revokedSession.data).toBeNull();
	});
});

describe("active-sessions list cleanup on session deletion (#1655)", async () => {
	// Regression test for the fork bug where deleteSession removed the token key
	// but left the token behind in the `active-sessions-{userId}` list, so a
	// logged-out session lingered for up to the session TTL. Mirrors production
	// config: secondaryStorage + storeSessionInDatabase: true. We assert on the
	// observable state of the secondaryStorage fake, not on internal calls.
	let store = new Map<string, string>();
	const { client, signInWithTestUser } = await getTestInstance({
		secondaryStorage: {
			set(key, value) {
				store.set(key, value);
			},
			get(key) {
				return store.get(key) || null;
			},
			delete(key) {
				store.delete(key);
			},
		},
		session: {
			storeSessionInDatabase: true,
		},
		rateLimit: {
			enabled: false,
		},
	});

	const listKey = (userId: string) => `active-sessions-${userId}`;
	const tokensInList = (userId: string): string[] => {
		const raw = store.get(listKey(userId));
		return raw
			? (JSON.parse(raw) as { token: string }[]).map((s) => s.token)
			: [];
	};

	it("signOut prunes the token and deletes the now-empty list key", async () => {
		store.clear();
		const { headers } = await signInWithTestUser();
		const session = await client.getSession({ fetchOptions: { headers } });
		const userId = session.data!.session.userId;
		const token = session.data!.session.token;

		// Sanity: the list registered the freshly created session.
		expect(tokensInList(userId)).toContain(token);

		await client.signOut({ fetchOptions: { headers } });

		// The token is pruned, and since it was the only session the list key
		// is removed entirely rather than left as an empty shell.
		expect(store.has(listKey(userId))).toBe(false);
	});

	it("signOut prunes only the target token when other sessions survive", async () => {
		store.clear();
		const first = await signInWithTestUser();
		const second = await signInWithTestUser();

		const firstSession = await client.getSession({
			fetchOptions: { headers: first.headers },
		});
		const secondSession = await client.getSession({
			fetchOptions: { headers: second.headers },
		});
		const userId = firstSession.data!.session.userId;
		const firstToken = firstSession.data!.session.token;
		const secondToken = secondSession.data!.session.token;

		expect(tokensInList(userId)).toEqual(
			expect.arrayContaining([firstToken, secondToken]),
		);

		await client.signOut({ fetchOptions: { headers: first.headers } });

		// The list survives, minus only the signed-out token.
		const remaining = tokensInList(userId);
		expect(remaining).toContain(secondToken);
		expect(remaining).not.toContain(firstToken);
	});

	it("revokeSessions clears the whole list key", async () => {
		store.clear();
		const { headers } = await signInWithTestUser();
		const session = await client.getSession({ fetchOptions: { headers } });
		const userId = session.data!.session.userId;

		expect(store.has(listKey(userId))).toBe(true);

		await client.revokeSessions({ fetchOptions: { headers } });

		expect(store.has(listKey(userId))).toBe(false);
	});
});

describe("cookie cache", async () => {
	const database: MemoryDB = {
		user: [],
		account: [],
		session: [],
		verification: [],
	};
	const adapter = memoryAdapter(database);

	const { client, testUser, auth, cookieSetter } = await getTestInstance({
		database: adapter,
		session: {
			cookieCache: {
				enabled: true,
			},
		},
	});
	const ctx = await auth.$context;

	it("should cache cookies", async () => {});
	const fn = vi.spyOn(ctx.adapter, "findOne");

	const headers = new Headers();
	it("should cache cookies", async () => {
		await client.signIn.email(
			{
				email: testUser.email,
				password: testUser.password,
			},
			{
				onSuccess(context) {
					const header = context.response.headers.get("set-cookie");
					const cookies = parseSetCookieHeader(header || "");
					headers.set(
						"cookie",
						`better-auth.session_token=${
							cookies.get("better-auth.session_token")?.value
						};better-auth.session_data=${
							cookies.get("better-auth.session_data")?.value
						}`,
					);
				},
			},
		);
		expect(fn).toHaveBeenCalledTimes(1);
		const session = await client.getSession({
			fetchOptions: {
				headers,
			},
		});
		expect(session.data).not.toBeNull();
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("should disable cookie cache", async () => {
		const ctx = await auth.$context;

		const s = await client.getSession({
			fetchOptions: {
				headers,
			},
		});
		expect(s.data?.user.emailVerified).toBe(false);
		await ctx.internalAdapter.updateUser(s.data?.user.id || "", {
			emailVerified: true,
		});
		expect(fn).toHaveBeenCalledTimes(1);

		const session = await client.getSession({
			query: {
				disableCookieCache: true,
			},
			fetchOptions: {
				headers,
			},
		});
		expect(session.data?.user.emailVerified).toBe(true);
		expect(session.data).not.toBeNull();
		expect(fn).toHaveBeenCalledTimes(3);
	});

	it("should reset cache when expires", async () => {
		expect(fn).toHaveBeenCalledTimes(3);
		await client.getSession({
			fetchOptions: {
				headers,
			},
		});
		vi.useFakeTimers();
		await vi.advanceTimersByTimeAsync(1000 * 60 * 10); // 10 minutes
		await client.getSession({
			fetchOptions: {
				headers,
				onSuccess(context) {
					cookieSetter(headers)(context);
				},
			},
		});
		expect(fn).toHaveBeenCalledTimes(5);
		await client.getSession({
			fetchOptions: {
				headers,
				onSuccess(context) {
					cookieSetter(headers)(context);
				},
			},
		});
		expect(fn).toHaveBeenCalledTimes(5);
	});
});
