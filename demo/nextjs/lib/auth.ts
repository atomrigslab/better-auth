import { betterAuth, parseState } from "better-auth";
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
  createAuthMiddleware,
  genericOAuth,
  jwt,
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
import { Resend } from "resend";
import { emailOTP, siwe } from "@/lib/plugins";
import { getSessionFromCtx } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { pga } from "./plugins/pga";

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
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  user: {
    // additionalFields: {
    //   mid: {
    //     type: "string",
    //     required: false,
    //     defaultValue: "",
    //   },
    // },
    changeEmail: {
      enabled: true,
    },
  },
  database: db,
  // emailVerification: {
  //   async sendVerificationEmail({ user, url }) {
  //     const res = await resend.emails.send({
  //       from,
  //       to: to || user.email,
  //       subject: "Verify your email address",
  //       html: `<a href="${url}">Verify your email address</a>`,
  //     });
  //     console.log(res, user.email);
  //   },
  // },
  account: {
    accountLinking: {
      // trustedProviders: ["google", "github", "demo-app"],
      // trustedProviders: ["google", 'V5xRiO3j9E5gch2sqssYFPuFvt83fgRF'],
      trustedProviders: ["google"],
    },
  },
  trustedOrigins: ["chrome-extension://dgoifpeldfmnlbangejfelgmgibpokej"],
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
      // disableImplicitSignUp: true,
    },
  },
  onAPIError: {
    onError: (e) => {
      console.log("auth.ts onAPIError onError");
      console.error(e);
    },
  },
  plugins: [
    siwe({ domain: "https://www.domain.com" }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // Implement the sendVerificationOTP method to send the OTP to the user's email address
        const resend = new Resend("re_ARsd8UNU_4EBJhanhfpXHBxiALTZNZ7rA");
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
      disableSignUp: true,
    }),
    pga(),
    bearer(),
    openAPI(),
    jwt(),
    customSession(async ({ user, session }) => {
      const mids = db.prepare("SELECT * FROM pga WHERE userId = ?").all(user.id).map(m => m.mid);
      const wallets = db.prepare("SELECT * FROM wallet WHERE userId = ?").all(user.id)
      // const roles = findUserRoles(session.session.userId);
      return {
          // roles,
          user: {
              ...user,
          },
          session,
          mid: mids,
          wallet: wallets
      };
  }),
    // oidcProvider({
    //   loginPage: "/sign-in",
    // }),
    // genericOAuth({
    //   config: [
    //     {
    //       providerId: "V5xRiO3j9E5gch2sqssYFPuFvt83fgRF",
    //       clientId: "cVnqhSkBcoYyszpjTGxCiiMOlURaZQUO",
    //       clientSecret: "PHlhqvLoijRgYFcBaSFtKvdvOwlvVyaf",
    //       discoveryUrl:
    //         "http://localhost:3000/api/auth/.well-known/openid-configuration",
    //       authorizationUrl: "http://localhost:3000/api/auth/oauth2/authorize",
    //       tokenUrl: "http://localhost:3000/api/auth/oauth2/token",
    //       scopes: ['email'],
    //       prompt: 'none',
    //     },
    //     // Add more providers as needed
    //   ],
    // }),
    // linkOAuth(),
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
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // if (ctx.path.startsWith("/sign-in/email-otp")) {
      //   console.log("/sign-in/email-otp after hook");
      //   console.log(Object.keys(ctx.context.returned));
      //   console.log(Object.values(ctx.context.returned));
      //   // console.log(ctx.context.session)
      //   console.log(ctx.query);
      //   // const isUserNotFound = Object.values(ctx.context.returned).find(
      //   //   (item) => item?.code === "USER_NOT_FOUND"
      //   // );
      //   const isUserNotFound =
      //     ctx.context.returned?.body?.code === "USER_NOT_FOUND";
      //   console.log("isUserNotFound", isUserNotFound);
      //   const existingSession = await getSessionFromCtx(ctx);
      //   if (!existingSession) {
      //     return;
      //   }
      //   console.log("getSessionFromCtx", existingSession?.session);
      //   if (!isUserNotFound) return;
      //   if (ctx.query.link) {
      //     const updatedUser = await ctx.context.internalAdapter.updateUser(
      //       existingSession.user.id,
      //       {
      //         email: ctx.body.email,
      //         emailVerified: true,
      //       },
      //       ctx
      //     );
      //     const session = await ctx.context.internalAdapter.createSession(
      //       existingSession.user.id,
      //       ctx.request
      //     );
      //     await setSessionCookie(ctx, {
      //       session,
      //       user: updatedUser,
      //     });
      //     return ctx.json({
      //       token: session.token,
      //       user: {
      //         id: updatedUser.id,
      //         email: updatedUser.email,
      //         emailVerified: updatedUser.emailVerified,
      //         name: updatedUser.name,
      //         image: updatedUser.image,
      //         createdAt: updatedUser.createdAt,
      //         updatedAt: updatedUser.updatedAt,
      //       },
      //     });
      //   } else {
      //     //
      //   }
      //   // update email and emailVerified as this error only happens when linking email auth to existing walle user
      //   //
      //   // const newSession = ctx.context.newSession;
      //   // if (newSession) {
      //   //   console.log("/sign-in/email-otp after hook newSession", newSession);
      //   // }
      // }
      // if (ctx.path.startsWith("/callback")) {
      //   const {
      //     codeVerifier,
      //     callbackURL,
      //     link,
      //     errorURL,
      //     newUserURL,
      //     requestSignUp,
      //   } = await parseState(ctx);
      //   if (link) {
      //     const existingSession = await getSessionFromCtx(ctx);
      //     if (!existingSession) {
      //       return;
      //     }
      //     await ctx.context.internalAdapter.updateUser(
      //       existingSession.user.id,
      //       {
      //         email: link.email,
      //         emailVerified: true,
      //       },
      //       ctx
      //     );
      //     // const existingAccount = await ctx.context.internalAdapter.findAccount(
      //     //   userInfo.id,
      //     // );
      //     // if (existingAccount) {
      //     //   if (existingAccount.userId.toString() !== link.userId.toString()) {
      //     //     return redirectOnError("account_already_linked_to_different_user");
      //     //   }
      //     // }
      //     // const newAccount = await c.context.internalAdapter.createAccount(
      //     //   {
      //     //     userId: link.userId,
      //     //     providerId: provider.id,
      //     //     accountId: userInfo.id,
      //     //     ...tokens,
      //     //     scope: tokens.scopes?.join(","),
      //     //   },
      //     //   c,
      //     // );
      //     // if (!newAccount) {
      //     //   return redirectOnError("unable_to_link_account");
      //     // }
      //     // let toRedirectTo: string;
      //     // try {
      //     //   const url = callbackURL;
      //     //   toRedirectTo = url.toString();
      //     // } catch {
      //     //   toRedirectTo = callbackURL;
      //     // }
      //     // throw c.redirect(toRedirectTo);
      //   }
      // }
    }),
  },
});
