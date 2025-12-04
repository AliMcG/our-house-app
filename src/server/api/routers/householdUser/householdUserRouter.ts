import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { addSingleUserToHousehold } from "../apiHelperFunctions";
import {
  createHouseholdInvite,
  findUserByEmail,
  sendEmailInvite,
} from "./householdUserService";
import { checkUserIsOwnerOfHousehold } from "../household/householdService";

/**
 * householdUserRouter router handles routes to add a new user to a household and delete a user from a household.
 */
export const householdUserRouter = createTRPCRouter({
  inviteToHousehold: protectedProcedure
    .input(
      z.object({
        householdId: z.string().min(1),
        invitedEmail: z.string().email().min(1),
        invitedName: z.string().min(1),
        senderName: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { householdId, invitedEmail, invitedName, senderName } = input;
      const senderUserId = ctx.session.user.id;
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
      try {
        const newHouseholdInvite = await createHouseholdInvite(
          householdId,
          senderUserId,
          invitedEmail,
          invitedName,
          ctx.db,
        );
        const householdInviteId = newHouseholdInvite.id;
        const userFoundByEmail = await findUserByEmail(invitedEmail, ctx.db);
        let isNewUser = true;
        if (userFoundByEmail) {
          /**
           * update the invite record with the invitedUserId
           */
          await ctx.db.householdInvite.update({
            where: { id: householdInviteId },
            data: { invitedUserId: userFoundByEmail.id },
          });
          isNewUser = false;
        }
        if (!userFoundByEmail) {
          /**
           * This is now a new person to send an email invite to
           */
          const emailSent = await sendEmailInvite(
            invitedEmail,
            senderName,
            householdInviteId,
            isNewUser,
            ctx.db,
          );
          return emailSent;
        }
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error creating invite`,
          cause: e,
        });
      }
    }),
  findInviteByToken: publicProcedure
    .input(z.object({ inviteToken: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const { inviteToken } = input;
      /** at this point we just need to make sure the token is valid:
       * - hash token before looking for it (todo: after invite acceptance logic is working)
       * - token exists
       * - token is not used
       * - token not expired
       */
      try {
        // retrieve invite details, inviters name and household name.
        return await ctx.db.householdInvite.findUnique({
          where: { token: inviteToken },
          include: {
            household: {
              select: {
                name: true,
              }
            },
            inviterUser: {
              select: {
                name: true,
              }
            }
          }
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Invite with token ${inviteToken} not found`,
          cause: e,
        });
      }
    }),
  /**
   * Route to handle the result of the invite being accepted or declined.
   * A user can either accept or decline an invite, via the link in the email or via the dashboard.
   * The email link will direct to a route /accept-invite?inviteToken=xxxx - this route will call this procedure with the token and accepted (true/false).
   * The dashboard will have a list of pending invites with accept/decline buttons - which will call this procedure with the userId and accepted.
   * Input: userId?, inviteToken?, accepted: 'accept' | 'decline'
   * This route will:
   * 1. Validate the inviteToken or userId to find the invite record.
   * 2. If accepted is 'accept', add the user to the household via addSingleUserToHousehold function.
   * 3. Update the invite record with status 'accepted' or 'declined'.
   * 4. Return the result.
   */
  processUserHouseholdInvite: protectedProcedure
    .input(
      z.object({
        inviteToken: z.string().min(1).optional(),
        userId: z.string().email().min(1).optional(),
        accepted: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Find the invite record
      const inviteRecord = await ctx.db.householdInvite.findFirst({
        where: input.inviteToken
          ? { token: input.inviteToken }
          : { invitedUserId: input.userId },
      });
      if (!inviteRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Invite not found`,
        });
      }
      const { householdId, id } = inviteRecord;
      if (!input.accepted) {
        // Update invite record to declined
        const updatedInvite = await ctx.db.householdInvite.update({
          where: { id: id },
          data: { status: "DECLINED" },
        });
        return updatedInvite;
      }

      // If the user already exists, use the userId from the UI input
      if (input.userId && input.accepted) {
        try {
          const result = await addSingleUserToHousehold(
            householdId,
            input.userId,
            ctx.db,
          );
          await ctx.db.householdInvite.update({
            where: { id: id },
            data: { status: "ACCEPTED" },
          });
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
                code: "CONFLICT",
                message: `Unable to add user: ${input.userId} to household: ${householdId} - user may already be a member of the household.`,
                cause: e,
              });
            } else {
              throw new TRPCError({
                code: "UNPROCESSABLE_CONTENT",
                message: e.code,
                cause: e,
              });
            }
          }
        }
      }
      if (input.inviteToken && input.accepted) {
        // The assumption here is that the user has accepted the invite via email link
        // but is not yet registered in the system. Or they are registered but we don't have their userId.
        // In a real system, we would likely have more logic here to handle user registration.
        throw new TRPCError({
          code: "NOT_IMPLEMENTED",
          message: `Accepting invites via token without userId is not implemented.`,
        });
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
            message: "User not deleted",
            cause: e,
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
