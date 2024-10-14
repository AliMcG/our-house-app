import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  findUserByEmail,
  addSingleUserToHousehold,
  checkUserIsOwnerOfHousehold,
} from "./apiHelperFunctions";

/**
 * householdUserRouter router handles routes to add a new user to household and deleet a user from a household.
 */

export const householdUserRouter = createTRPCRouter({
  /**
   * Current assumption that the user to add is already a signed up user -
   * Future Feature to develop - send email request to completely new user.
   */
  addNewUserToHousehold: protectedProcedure
    .input(z.object({ householdId: z.string(), userEmail: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const newMemberId = await findUserByEmail(input.userEmail, ctx.db);
      if (!newMemberId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User with email ${input.userEmail} not found`,
        });
      }
      try {
        const result = await addSingleUserToHousehold(
          input.householdId,
          newMemberId,
          ctx.db,
        );
        return result;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          /**
           * Prisma error codes: https://www.prisma.io/docs/orm/reference/error-reference#error-codes
           */
          if (e.code === "P2002") {
            console.log(
              "There is a unique constraint violation, a new user cannot be created with this email",
            );
            /**
             * TRPC error is caught by the onError hook in the client code
             */
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: `Email address already in use: ${input.userEmail}`,
            });
          } else {
            console.log("e.code", e.code);
          }
        }
      }
    }),

  deleteUserFromHousehold: protectedProcedure
    .input(
      z.object({
        userEmail: z.string().email().min(1),
        householdId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = await findUserByEmail(input.userEmail, ctx.db);
      if (!userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User with email findUserByEmail ${input.userEmail} not found`,
        });
      }
      const isHouseholdOwner = await checkUserIsOwnerOfHousehold(
        input.householdId,
        ctx.session.user.id,
        ctx.db,
      );
      if (isHouseholdOwner) {
        try {
          const result = ctx.db.householdUser.delete({
            where: {
              userId_householdId: {
                userId: userId,
                householdId: input.householdId,
              },
            },
          });
          return result;
        } catch (e) {
          throw new TRPCError({
            code: "NOT_IMPLEMENTED",
            message: 'User not deleted',
          });
        }
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You are not the owner of the household - no permission to delete`,
        });
      }
    }),
});
