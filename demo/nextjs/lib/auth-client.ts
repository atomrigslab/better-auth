import { createAuthClient } from "better-auth/react";
import {
	organizationClient,
	passkeyClient,
	twoFactorClient,
	adminClient,
	multiSessionClient,
	oneTapClient,
	oidcClient,
	genericOAuthClient,
	customSessionClient,
} from "better-auth/client/plugins";
import { toast } from "sonner";
import { stripeClient } from "@better-auth/stripe/client";
// import { emailOTPClient } from 'better-auth/client/plugins';
import { siweClientPlugin } from "./plugins/wallet/client";
import { emailOTPClient } from "./plugins/email-otp/client";
import { oauthLinkClient } from "./plugins/oauth/client";
import { pgaClientPlugin } from "./plugins/pga/client";
import { auth } from "./auth";

export const client = createAuthClient({
	baseURL: 'http://localhost:5173',
	plugins: [
		// organizationClient(),
		// twoFactorClient({
		// 	onTwoFactorRedirect() {
		// 		window.location.href = "/two-factor";
		// 	},
		// }),
		// passkeyClient(),
		// adminClient(),
		// multiSessionClient(),
		// oneTapClient({
		// 	clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
		// 	promptOptions: {
		// 		maxAttempts: 1,
		// 	},
		// }),
		// oidcClient(),
		// genericOAuthClient(),
		// stripeClient({
		// 	subscription: true,
		// }),
		emailOTPClient(),
		siweClientPlugin(),
		pgaClientPlugin(),
		customSessionClient<typeof auth>(),
		// oauthLinkClient(),
	],
	fetchOptions: {
		onError(e) {
			if (e.error.status === 429) {
				toast.error("Too many requests. Please try again later.");
			}
		},
	},
});

export const {
	signUp,
	signIn,
	signOut,
	useSession,
	// organization,
	// useListOrganizations,
	// useActiveOrganization,
	linkSocial,
	updateUser,
	emailOtp,
	pga,
} = client;

client.$store.listen("$sessionSignal", async () => {});
