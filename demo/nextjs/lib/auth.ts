import { betterAuth } from "better-auth";
import {
  bearer,
  openAPI,
  customSession,
  jwt,
} from "better-auth/plugins";
import Database from "better-sqlite3";
import { Resend } from "resend";
import { emailOTP, siwe } from "@/lib/plugins";
import { pga } from "./plugins/pga";


const db = new Database("./sqlite.db");


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
    changeEmail: {
      enabled: true,
    },
  },
  database: db,
  account: {
    accountLinking: {
      trustedProviders: ["google"],
    },
  },
  trustedOrigins: ["chrome-extension://dgoifpeldfmnlbangejfelgmgibpokej"],
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
        const resend = new Resend("re_ARsd8UNU_4EBJhanhfpXHBxiALTZNZ7rA");
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Verify your email address",
          text: `Click the link to verify otp: ${otp}`,
        });
      },
      // disableSignUp: true,
    }),
    pga(),
    bearer(),
    openAPI(),
    jwt(),
    customSession(async ({ user, session }) => {
      const mids = db
        .prepare("SELECT * FROM pga WHERE userId = ?")
        .all(user.id)
        .map((m) => m.mid);
      const wallets = db
        .prepare("SELECT * FROM wallet WHERE userId = ?")
        .all(user.id);
      const accounts = db
        .prepare("SELECT * FROM account WHERE userId = ?")
        .all(user.id);
      return {
        user: {
          ...user,
        },
        session,
        mid: mids,
        wallet: wallets,
        account: accounts,
      };
    }),
  ],
});
