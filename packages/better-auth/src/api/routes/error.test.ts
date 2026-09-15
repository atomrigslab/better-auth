import { describe, expect, it } from "vitest";
import { betterAuth } from "../../auth";
import { memoryAdapter } from "../../adapters/memory-adapter";

/**
 * `/error` is the one screen an app cannot reach into: it is served from the
 * auth origin, in English, and its only control is `<a href="/">` — which in a
 * split-origin deployment points at the auth host rather than at the app.
 *
 * An app that named `onAPIError.errorURL` has already said where a failure
 * belongs. Every failure raised AFTER a state can be read honours that (see
 * `api/routes/callback.ts`); the ones raised BEFORE it can — a replayed state,
 * an expired one — redirect straight to this route instead, which is how a
 * caller that named a screen still ends up on this page.
 *
 * So these assert the two halves of one rule: the named screen wins when there
 * is one, and nothing moves for an app that named none.
 */

const BASE_URL = "http://localhost:3000";
const ERROR_URL = "http://app.localhost:3000/auth/login";

function makeAuth(errorURL?: string) {
	return betterAuth({
		database: memoryAdapter({ user: [], session: [], account: [], verification: [] }),
		secret: "x".repeat(32),
		baseURL: BASE_URL,
		trustedOrigins: ["http://app.localhost:3000"],
		...(errorURL ? { onAPIError: { errorURL } } : {}),
	});
}

function get(auth: ReturnType<typeof makeAuth>, query: string) {
	return auth.handler(new Request(`${BASE_URL}/api/auth/error${query}`));
}

describe("/error", () => {
	it("sends the caller to the screen it named, carrying the code", async () => {
		const res = await get(makeAuth(ERROR_URL), "?error=please_restart_the_process");

		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe(
			`${ERROR_URL}?error=please_restart_the_process`,
		);
	});

	// The named screen is allowed to carry its own query — the app's own
	// "something failed" flag, for instance — so the code is appended to it
	// rather than replacing it.
	it("keeps the query the named screen already carries", async () => {
		const res = await get(makeAuth(`${ERROR_URL}?error=true`), "?error=state_not_found");

		expect(res.headers.get("location")).toBe(
			`${ERROR_URL}?error=true&error=state_not_found`,
		);
	});

	// Without this, "the code rides along" could pass for a route that forwards
	// whatever it is handed, including nothing.
	it("names the code Unknown when the query carries none", async () => {
		const res = await get(makeAuth(ERROR_URL), "");

		expect(res.headers.get("location")).toBe(`${ERROR_URL}?error=Unknown`);
	});

	// The existing behaviour, and the reason the redirect is conditional: an app
	// that named no screen still gets the page, because there is nowhere else to
	// send it.
	it("still serves the page when the app named no screen", async () => {
		const res = await get(makeAuth(), "?error=please_restart_the_process");

		expect(res.status).toBe(200);
		expect(res.headers.get("content-type")).toContain("text/html");
		expect(await res.text()).toContain("please_restart_the_process");
	});
});
