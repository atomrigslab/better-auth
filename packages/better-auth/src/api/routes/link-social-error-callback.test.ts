import { describe, expect, it } from "vitest";
import { getTestInstance } from "../../test-utils/test-instance";

/**
 * The field only earns its line if it SURVIVES the request. Everything after
 * that point already worked: `generateState` reads `c.body.errorCallbackURL`,
 * `parseState` hands it back as `errorURL`, and the OAuth callback redirects
 * there. What was missing is that the body schema never named the field, so zod
 * dropped it and every one of those steps saw `undefined`.
 *
 * So this asserts on the stored state rather than on a redirect: the state is
 * the first place the value can be observed, and the only place the schema can
 * have broken it.
 */
describe("link-social errorCallbackURL", async () => {
	const { auth, client, signInWithTestUser } = await getTestInstance();
	const ctx = await auth.$context;
	const { headers } = await signInWithTestUser();

	async function startLink(body: Record<string, unknown>) {
		const res = await client.linkSocial(body as never, { headers });
		const url = (res.data as { url?: string } | null)?.url ?? "";
		const state = url ? new URL(url).searchParams.get("state") ?? "" : "";
		const row = state
			? await ctx.internalAdapter.findVerificationValue(state)
			: null;
		return {
			url,
			state,
			stored: row ? (JSON.parse(row.value) as Record<string, unknown>) : null,
		};
	}

	it("carries the caller's errorCallbackURL into the state", async () => {
		const { url, state, stored } = await startLink({
			provider: "google",
			callbackURL: "/callback",
			errorCallbackURL: "/link-conflict",
		});

		expect(url).toContain("google.com");
		expect(state).not.toBe("");
		expect(stored?.errorURL).toBe("/link-conflict");
	});

	// Without this, "the field is carried" could pass for a state that carries
	// every URL it is handed, including the success one.
	it("keeps it distinct from the success destination", async () => {
		const { stored } = await startLink({
			provider: "google",
			callbackURL: "/callback",
			errorCallbackURL: "/link-conflict",
		});

		expect(stored?.callbackURL).toBe("/callback");
		expect(stored?.errorURL).not.toBe(stored?.callbackURL);
	});

	// A caller that names nothing must be unchanged by this: `parseState` fills
	// in the server's own error page later, which is the behaviour every existing
	// caller has today.
	it("leaves the state alone when the caller names no error screen", async () => {
		const { stored } = await startLink({
			provider: "google",
			callbackURL: "/callback",
		});

		expect(stored?.callbackURL).toBe("/callback");
		expect(stored?.errorURL).toBeUndefined();
	});
});
