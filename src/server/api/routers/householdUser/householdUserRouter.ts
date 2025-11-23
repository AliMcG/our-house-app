import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  addSingleUserToHousehold,
} from "../apiHelperFunctions";
import { createHouseholdInvite, findUserByEmail, sendEmailInvite } from "./householdUserService";
import { checkUserIsOwnerOfHousehold } from "../household/householdService";

/**
 * householdUserRouter router handles routes to add a new user to a household and delete a user from a household.
 */
export const householdUserRouter = createTRPCRouter({
  inviteToHousehold: protectedProcedure
    .input(z.object({ householdId: z.string().min(1), invitedEmail: z.string().email().min(1), invitedName: z.string().min(1), senderName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { householdId, invitedEmail, invitedName, senderName } = input
      const senderUserId = ctx.session.user.id
      const isHouseholdOwner = await checkUserIsOwnerOfHousehold(
        householdId,
        senderUserId,
        ctx.db,
      );
      if (!isHouseholdOwner) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You are not the owner of the household - no permission to send invites`,
        });
      }

      const newHouseholdInvite = await createHouseholdInvite(householdId, senderUserId, invitedEmail, invitedName, ctx.db)
      const householdInviteId = newHouseholdInvite.id
      const userFoundByEmail = await findUserByEmail(invitedEmail, ctx.db);
      if (!userFoundByEmail) {
        /**
         * This is now a new person to send an email invite to
         */
        const emailSent = await sendEmailInvite(invitedEmail, senderName, householdInviteId, ctx.db)
        return emailSent
      }
      // If userFoundByEmail then we can send an internal invite to the already registered user.
    }),
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
          newMemberId.id,
          ctx.db,
        );
        return result;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          /**
           * Prisma error codes: https://www.prisma.io/docs/orm/reference/error-reference#error-codes
           */
          if (e.code === "P2002") {
            /**
             * TRPC error is caught by the onError hook in the client code
             */
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: `Email address already in use: ${input.userEmail}`,
              cause: e
            });
          } else {
            throw new TRPCError({
              code: "UNPROCESSABLE_CONTENT",
              message: e.code,
              cause: e
            });
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
                userId: userId.id,
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
