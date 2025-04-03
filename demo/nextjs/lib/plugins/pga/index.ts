import {
  BetterAuthPlugin,
  createAuthEndpoint,
  ERROR_CODES,
} from "better-auth/plugins";
import { z } from "zod";
import { db } from "@/lib/db";
import { APIError, generateId } from "better-auth";
import { getSessionFromCtx } from "better-auth/api";

export const pga = () => {
  return {
    id: "pga",
    schema: {
      pga: {
        fields: {
          userId: {
            type: "string",
            required: true,
          },
          mid: {
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
      addMid: createAuthEndpoint(
        "/pga/add-mid",
        {
          method: "POST",
          body: z.object({
            encryptedMid: z.string(),
          }),
        },
        async (ctx) => {
          // TODO: decode mid
          const id = generateId();
          const existingSession = await getSessionFromCtx(ctx);
          if (!existingSession) {
            throw new APIError("BAD_REQUEST", {
              message: ERROR_CODES.UNAUTHORIZED_SESSION,
            });
          }
          let insertStatement = db
            .prepare(
              "INSERT INTO pga (id, userId, mid, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)"
            )
            .run(
              id,
              existingSession.user.id,
              ctx.body.encryptedMid,
              new Date().toISOString(),
              new Date().toISOString()
            );

          console.log("insertStatement", insertStatement);
        }
      ),
      getUserByMid: createAuthEndpoint(
        "/pga/get-user-by-mid",
        {
          method: "GET",
        },
        async (ctx) => {
          const mid = ctx?.query?.encryptedMid;
          // TODO: decode mid

          let pga = db.prepare("SELECT * FROM pga WHERE mid = ?").get(mid);

          if (!pga) {
            return { user: null, accounts: [] };
          }

          const userId = pga?.userId;

          // fetch user and accounts
          const user = db
            .prepare("SELECT * FROM user WHERE id = ?")
            .get(userId);
          const accounts =
            await ctx.context.internalAdapter.findAccounts(userId);

          return { user, accounts };
        }
      ),
    },
  } satisfies BetterAuthPlugin;
};
