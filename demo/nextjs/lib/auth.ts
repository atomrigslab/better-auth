import { betterAuth } from "better-auth";
import { bearer, openAPI, customSession, jwt } from "better-auth/plugins";
import { Resend } from "resend";
import { emailOTP, siwe } from "@/lib/plugins";
import { pga } from "./plugins/pga";
import pkg from "pg";
import { mobile } from "./plugins/mobile";

const { Pool } = pkg;
export const db = new Pool({
  connectionString: "postgres://user:password@localhost:5432/database",
});

export const auth = betterAuth({
  appName: "Better Auth Demo",
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
  account: {
    accountLinking: {
      trustedProviders: ["google"],
    },
  },
  database: db,
  trustedOrigins: ["chrome-extension://dgoifpeldfmnlbangejfelgmgibpokej", "http://localhost:3000"],
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
    mobile(),
    customSession(async ({ user, session }) => {
      const mids = (
        await db.query('SELECT * FROM pga WHERE "userId" = $1', [user.id])
      ).rows;
      const wallets = (
        await db.query('SELECT * FROM wallet WHERE "userId" = $1', [
          user.id,
        ])
      ).rows;
      const accounts = (
        await db.query('SELECT * FROM account WHERE "userId" = $1', [
          user.id,
        ])
      ).rows;
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
