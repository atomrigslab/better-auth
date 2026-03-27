import { generateId } from "better-auth";
import {
  type BetterAuthPlugin,
  //   type User,
  // setSessionCookie
} from "better-auth";
import {
  APIError,
  createAuthEndpoint,
  getSessionFromCtx,
} from "better-auth/api";

// Database Instance
// import { db } from '@repo/db/drizzle';
// import { eq, user as userTable } from '@@repo/db/schema';

// Zod
import { z } from "zod";

// SIWE deps
import { SiweMessage, generateNonce } from "siwe";
// import { http, createConfig, getEnsName, getEnsAvatar } from '@wagmi/core';
// import { mainnet, sepolia } from '@wagmi/core/chains';
import { setSessionCookie } from "better-auth/cookies";
// import { db } from "@/lib/db";
import { ERROR_CODES } from "better-auth/plugins";
import { db } from "@/lib/auth";

export interface SIWEPluginOptions {
  domain: string;
  // Optional configuration
  chainId?: 1 | 11155111 | undefined;
  version?: string;
  resources?: string[];
}

// export const wagmiConfig = createConfig({
// 	chains: [mainnet, sepolia],
// 	transports: {
// 		[mainnet.id]: http('https://eth.llamarpc.com'),
// 		[sepolia.id]: http()
// 	}
// });

export const siwe = (options: SIWEPluginOptions) =>
  ({
    id: "siwe",
    schema: {
      wallet: {
        fields: {
          userId: {
            type: "string",
            required: true,
          },
          name: {
            type: "string",
            required: true,
          },
          address: {
            type: "string",
            required: true,
          },
          createdAt: {
            type: "date",
          },
          updatedAt: {
            type: "date",
          },
        },
      },
    },
    endpoints: {
      nonce: createAuthEndpoint(
        "/sign-in/nonce",
        {
          method: "POST",
          body: z.object({
            address: z.string(),
          }),
        },
        async (ctx) => {
          const nonce = generateNonce();
          // Store nonce with 15-minute expiration
          await ctx.context.internalAdapter.createVerificationValue({
            id: generateId(),
            identifier: `siwe_${ctx.body.address.toLowerCase()}`,
            value: nonce,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
          });

          return { nonce };
        }
      ),
      // Verify siwe payload
      verify: createAuthEndpoint(
        "/sign-in/verify",
        {
          method: "POST",
          body: z.object({
            message: z.string(),
            signature: z.string(),
            address: z.string(),
            walletName: z.string(),
          }),
        },
        async (ctx) => {
          console.log("body", ctx.body);
          const { message, signature, walletName } = ctx.body;
          // Parse and validate SIWE message
          const siweMessage = new SiweMessage(message);
          console.log("siweMessage", siweMessage);

          try {
            // Find stored nonce to check it's validity
            const verification =
              await ctx.context.internalAdapter.findVerificationValue(
                `siwe_${ctx.body.address.toLowerCase()}`
              );
            console.log("verification", verification);
            // Ensure nonce is valid and not expired
            if (!verification || new Date() > verification.expiresAt) {
              throw new APIError("UNAUTHORIZED", {
                message: "Unauthorized: Invalid or expired nonce",
              });
            }
            // Verify SIWE message
            const verified = await siweMessage.verify({
              signature,
              nonce: verification.value,
              // domain: options.domain,
            });
            console.log("verified", verified);

            if (!verified.success) {
              throw new APIError("UNAUTHORIZED", {
                message: "Unauthorized: Invalid SIWE signature",
              });
            }

            // Delete used nonce to prevent replay attacks
            // now moved to n after hook on /sign-out route
            // await ctx.context.internalAdapter.deleteVerificationValue(
            //   verification.id
            // );

            // const mid = 'fake-mid';
            // let user = db
            //   .prepare("SELECT * FROM user WHERE address = ?")
            //   .get(ctx.body.address);
            // let wallet = db
            //   .prepare("SELECT * FROM wallet WHERE address = ?")
            //   .get(ctx.body.address);
            const wallet = (
              await db.query("SELECT * FROM wallet WHERE address = $1", [
                ctx.body.address,
              ])
            ).rows[0];
            console.log("existing wallet", {
              value: wallet,
              type: typeof wallet,
            });

            let user = undefined;

            if (!wallet) {
              const tempEmail = `${ctx.body.address}@${process.env.BETTER_AUTH_URL}`;

              user = await ctx.context.internalAdapter.createUser({
                name: ctx.body.address,
                email: tempEmail,
                address: ctx.body.address,
                avatar: "",
              });

              const id = generateId();
              const now = new Date().toISOString();
              await db.query(
                'INSERT INTO wallet (id, "userId", name, address, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [id, user.id, walletName, ctx.body.address, now, now]
              );
            } else {
              user = (
                await db.query('SELECT * FROM "user" WHERE id = $1', [
                  wallet.userId
                ])
              ).rows[0];
            }

            const session = await ctx.context.internalAdapter.createSession(
              user?.id,
              ctx.request
            );

            if (!session) {
              return ctx.json(null, {
                status: 500,
                body: {
                  message: "Internal Server Error",
                  status: 500,
                },
              });
            }

            await setSessionCookie(ctx, { session, user });

            return ctx.json({ token: session.token });
          } catch (error: any) {
            if (error instanceof APIError) throw error;
            throw new APIError("UNAUTHORIZED", {
              message: "Something went wrong. Please try again later.",
              error: error.message,
            });
          }
        }
      ),

      link: createAuthEndpoint(
        "/sign-in/wallet-link",
        {
          method: "POST",
          body: z.object({
            message: z.string(),
            signature: z.string(),
            address: z.string(),
            walletName: z.string(),
          }),
        },
        async (ctx) => {
          const { message, signature } = ctx.body;
          // Parse and validate SIWE message
          const siweMessage = new SiweMessage(message);

          try {
            // Find stored nonce to check it's validity
            const verification =
              await ctx.context.internalAdapter.findVerificationValue(
                `siwe_${ctx.body.address.toLowerCase()}`
              );
            // Ensure nonce is valid and not expired
            if (!verification || new Date() > verification.expiresAt) {
              throw new APIError("UNAUTHORIZED", {
                message: "Unauthorized: Invalid or expired nonce",
              });
            }
            // Verify SIWE message
            const verified = await siweMessage.verify({
              signature,
              nonce: verification.value,
              // domain: options.domain,
            });
            console.log("verified", verified);

            if (!verified.success) {
              throw new APIError("UNAUTHORIZED", {
                message: "Unauthorized: Invalid SIWE signature",
              });
            }

            const existingSession = await getSessionFromCtx(ctx);
            console.log("existingSession", existingSession);
            if (!existingSession) {
              throw new APIError("BAD_REQUEST", {
                message: ERROR_CODES.UNAUTHORIZED_SESSION,
              });
            }

            //   let wallet = db
            //   .prepare("SELECT * FROM wallet WHERE address = ?")
            //   .get(ctx.body.address);
            // console.log("existing wallet", { value: wallet, type: typeof wallet });
            // let user = undefined;

            // const user = await ctx.context.internalAdapter.updateUser(
            //   existingSession.user?.id,
            //   {
            //     address: ctx.body.address,
            //   },
            //   ctx
            // );

            const userId = existingSession.user.id;

            const id = generateId();
            const now = new Date().toISOString();
            const result = await db.query(
              'INSERT INTO wallet (id, "userId", name, address, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
              [id, userId, ctx.body.walletName, ctx.body.address, now, now]
            );
            // const insertStatement = db
            //   .prepare(
            //     "INSERT INTO wallet (id, userId, name, address, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
            //   )
            //   .run(
            //     id,
            //     userId,
            //     ctx.body.walletName,
            //     ctx.body.address,
            //     new Date().toISOString(),
            //     new Date().toISOString()
            //   );

            const session = await ctx.context.internalAdapter.createSession(
              userId,
              ctx.request
            );

            if (!session) {
              return ctx.json(null, {
                status: 500,
                body: {
                  message: "Internal Server Error",
                  status: 500,
                },
              });
            }

            await setSessionCookie(ctx, {
              session,
              user: existingSession.user,
            });

            return ctx.json({ token: session.token });
          } catch (error: any) {
            console.log("error", error);
            if (error instanceof APIError) throw error;
            throw new APIError("UNAUTHORIZED", {
              message: "Something went wrong. Please try again later.",
              error: error.message,
            });
          }
        }
      ),
    },
  }) satisfies BetterAuthPlugin;
