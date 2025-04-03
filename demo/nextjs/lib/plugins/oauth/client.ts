import { BetterAuthClientPlugin } from "better-auth/types";
import type { oAuthLink } from ".";

export const oauthLinkClient = () => {
	return {
		id: "oauth-link",
		$InferServerPlugin: {} as ReturnType<typeof oAuthLink>,
	} satisfies BetterAuthClientPlugin;
};
