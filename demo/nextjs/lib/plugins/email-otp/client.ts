import { BetterAuthClientPlugin } from "better-auth/types";
import type { emailOTP } from ".";

export const emailOTPClient = () => {
	return {
		id: "email-otp",
		$InferServerPlugin: {} as ReturnType<typeof emailOTP>,
	} satisfies BetterAuthClientPlugin;
};
