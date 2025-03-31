import { betterAuth } from "better-auth";
import {
  bearer,
  admin,
  multiSession,
  organization,
  twoFactor,
  oneTap,
  oAuthProxy,
  openAPI,
  oidcProvider,
  customSession,
} from "better-auth/plugins";
import { reactInvitationEmail } from "./email/invitation";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { reactResetPasswordEmail } from "./email/reset-password";
import { resend } from "./email/resend";
import { MysqlDialect } from "kysely";
import { createPool } from "mysql2/promise";
import { nextCookies } from "better-auth/next-js";
import { passkey } from "better-auth/plugins/passkey";
import { stripe } from "@better-auth/stripe";
import { Stripe } from "stripe";
import Database from "better-sqlite3";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import { siwe } from "./plugins/wallet";

const from = process.env.BETTER_AUTH_EMAIL || "delivered@resend.dev";
const to = process.env.TEST_EMAIL || "";

const db = new Database("./sqlite.db");

// const libsql = new LibsqlDialect({
// 	url: process.env.TURSO_DATABASE_URL || "",
// 	authToken: process.env.TURSO_AUTH_TOKEN || "",
// });

// const mysql = process.env.USE_MYSQL
// 	? new MysqlDialect(createPool(process.env.MYSQL_DATABASE_URL || ""))
// 	: null;

// const dialect = process.env.USE_MYSQL ? mysql : libsql;

// if (!dialect) {
// 	throw new Error("No dialect found");
// }

const PROFESSION_PRICE_ID = {
  default: "price_1QxWZ5LUjnrYIrml5Dnwnl0X",
  annual: "price_1QxWZTLUjnrYIrmlyJYpwyhz",
};
const STARTER_PRICE_ID = {
  default: "price_1QxWWtLUjnrYIrmleljPKszG",
  annual: "price_1QxWYqLUjnrYIrmlonqPThVF",
};

export const auth = betterAuth({
  appName: "Better Auth Demo",
  // database: {
  // 	dialect,
  // 	type: process.env.USE_MYSQL ? "mysql" : "sqlite",
  // },
  user: {
    additionalFields: {
      mid: {
				type: 'string',
				required: false,
				defaultValue: ''
      }
    }
  },
  database: db,
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      const res = await resend.emails.send({
        from,
        to: to || user.email,
        subject: "Verify your email address",
        html: `<a href="${url}">Verify your email address</a>`,
      });
      console.log(res, user.email);
    },
  },
  account: {
    accountLinking: {
      // trustedProviders: ["google", "github", "demo-app"],
      trustedProviders: ["google"],
    },
  },
  // emailAndPassword: {
  // 	enabled: true,
  // 	async sendResetPassword({ user, url }) {
  // 		await resend.emails.send({
  // 			from,
  // 			to: user.email,
  // 			subject: "Reset your password",
  // 			react: reactResetPasswordEmail({
  // 				username: user.email,
  // 				resetLink: url,
  // 			}),
  // 		});
  // 	},
  // },
  socialProviders: {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [
    siwe({ domain: 'https://www.domain.com' }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // Implement the sendVerificationOTP method to send the OTP to the user's email address
		const resend = new Resend('re_ARsd8UNU_4EBJhanhfpXHBxiALTZNZ7rA');
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Verify your email address",
          text: `Click the link to verify otp: ${otp}`,
        });

        // if (type === "sign-in") {
        //     // Send the OTP for sign-in
        // } else if (type === "email-verification") {
        //     // Send the OTP for email verification
        // } else {
        //     // Send the OTP for password reset
        // }
      },
    }),
    // organization({
    // 	async sendInvitationEmail(data) {
    // 		await resend.emails.send({
    // 			from,
    // 			to: data.email,
    // 			subject: "You've been invited to join an organization",
    // 			react: reactInvitationEmail({
    // 				username: data.email,
    // 				invitedByUsername: data.inviter.user.name,
    // 				invitedByEmail: data.inviter.user.email,
    // 				teamName: data.organization.name,
    // 				inviteLink:
    // 					process.env.NODE_ENV === "development"
    // 						? `http://localhost:3000/accept-invitation/${data.id}`
    // 						: `${
    // 								process.env.BETTER_AUTH_URL ||
    // 								"https://demo.better-auth.com"
    // 							}/accept-invitation/${data.id}`,
    // 			}),
    // 		});
    // 	},
    // }),
    // openAPI(),
    // bearer(),
    // admin({
    // 	adminUserIds: ["EXD5zjob2SD6CBWcEQ6OpLRHcyoUbnaB"],
    // }),
    // multiSession(),
    // nextCookies(),
    // customSession(async (session) => {
    // 	return {
    // 		...session,
    // 		user: {
    // 			...session.user,
    // 			dd: "test",
    // 		},
    // 	};
    // }),
  ],
});
