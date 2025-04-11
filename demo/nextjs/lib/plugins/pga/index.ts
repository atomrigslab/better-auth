import {
  BetterAuthPlugin,
  createAuthEndpoint,
  ERROR_CODES,
} from "better-auth/plugins";
import { z } from "zod";
// import { db } from "@/lib/db";
import { APIError, generateId } from "better-auth";
import { getSessionFromCtx } from "better-auth/api";
import { db } from "@/lib/auth";

export const pga = () => {
  return {
    id: "pga",
    schema: {
      pga: {
        modelName: "pga",
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
          try {
            // TODO: decode mid
            const mid = ctx.body.encryptedMid;
            const id = generateId();
            const existingSession = await getSessionFromCtx(ctx);
            if (!existingSession) {
              throw new APIError("BAD_REQUEST", {
                message: ERROR_CODES.UNAUTHORIZED_SESSION,
              });
            }
            // const pga = db
            //   .prepare("SELECT * FROM pga WHERE userId = ? AND mid = ?")
            //   .get(existingSession.user.id, mid);
            // if (pga) {
            //   console.log("pga exist with", {
            //     userId: existingSession.user.id,
            //     mid,
            //   });
            //   return;
            // }
            const userId = existingSession.user.id;
            // const pga = db.prepare("SELECT * FROM pga WHERE mid = ?").all(mid);
            const pga = (
              await db.query('SELECT * FROM pga WHERE mid = $1', [mid])
            ).rows;
            console.log("pga", { mid, userId });
            // const myPga = pga.find((p) => p.userId === userId && p.mid === mid);
            const myPga = pga.find((p) => p.mid === mid);
            if (myPga) {
              console.log("pga exist with", {
                userId: userId,
                mid,
                pga,
              });
              return;
            }
            // const otherPga = pga.filter((p) => p.userId !== userId);
            // otherPga.forEach((p) => {
            //   const deleteStatement = db
            //     .prepare("DELETE FROM pga WHERE userId = ? AND mid = ?")
            //     .run(p.userId, mid);
            //   console.log(`Deleted ${deleteStatement.changes} row(s)`);
            // });

            // const insertStatement = db
            //   .prepare(
            //     "INSERT INTO pga (id, userId, mid, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)"
            //   )
            //   .run(
            //     id,
            //     userId,
            //     mid,
            //     new Date().toISOString(),
            //     new Date().toISOString()
            //   );
            // console.log("insertStatement", insertStatement);
          } catch (error) {
            console.error(error);
          }
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

          // let pga = db.prepare("SELECT * FROM pga WHERE mid = ?").get(mid);

          const pga = (
            await db.query('SELECT * FROM pga WHERE mid = $1', [mid])
          ).rows[0];
          if (!pga) {
            return { user: null, accounts: [] };
          }

          const userId = pga?.userId;

          // fetch user and accounts
          // const user = db
          //   .prepare("SELECT * FROM user WHERE id = ?")
          //   .get(userId);
          const user = (
            await db.query('SELECT * FROM user WHERE id = $1', [userId])
          ).rows[0];
          const accounts =
            await ctx.context.internalAdapter.findAccounts(userId);

          return { user, accounts };
        }
      ),
    },
  } satisfies BetterAuthPlugin;
};
