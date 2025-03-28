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
} from "better-auth/client/plugins";
import { toast } from "sonner";
import { stripeClient } from "@better-auth/stripe/client";
import { emailOTPClient } from 'better-auth/client/plugins';
import { siweClientPlugin } from "./plugins/wallet/client";

export const client = createAuthClient({
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
	emailOtp,
} = client;

client.$store.listen("$sessionSignal", async () => {});
