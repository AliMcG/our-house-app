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
      /**
       * Check that the invited email is not already a member of the household
       * or that there is not already a pending invite for this email and household
       */
      const existingUser = await ctx.db.householdUser.findFirst({
        where: {
          householdId: householdId,
          user: { email: invitedEmail },
        },
      });
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `User with email ${invitedEmail} is already a member of the household`,
        });
      }
      const existingInvite = await ctx.db.householdInvite.findFirst({
        where: {
          householdId: householdId,
          invitedEmail: invitedEmail,
          status: "PENDING",
        },
      });
      if (existingInvite) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `An invite has already been sent to ${invitedEmail} for this household`,
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
        /**
         * Send email invite to the invited email address
         * The variable isNewUser indicates if the email is for a new user or an existing user
         */
        const emailSent = await sendEmailInvite(
          invitedEmail,
          senderName,
          householdInviteId,
          isNewUser,
          ctx.db,
        );
        return emailSent;
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
      try {
        /**
         * Retrieve the invite by token and include household name and inviter's name
         * These details are needed to display on the invite acceptance page
         */
        const invite = await ctx.db.householdInvite.findUnique({
          where: { token: inviteToken },
          include: {
            household: {
              select: {
                name: true,
              },
            },
            inviterUser: {
              select: {
                name: true,
              },
            },
          },
        });

        /**
         * If no invite found with that token
         * throw not found error
         */
        if (!invite) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Invite with token ${inviteToken} not found`,
          });
        }

        /**
         * Check if invite is expired, if so update status to EXPIRED
         * We can also choose to delete expired invites instead?
         * If expired throw error
         */
        const now = new Date();
        const isExpired = invite.expiresAt && now > invite.expiresAt;
        if (isExpired) {
          await ctx.db.householdInvite.delete({
            where: { id: invite.id },
          });
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Invite with token ${inviteToken} has expired`,
          });
        }

        /**
         * Check if invite has already been used and throw error if so
         */
        if (invite.status != "PENDING") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Invite with token ${inviteToken} already used`,
          });
        }

        return invite;
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
        inviteToken: z.string().min(1),
        userId: z.string().min(1),
        accepted: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      /**
       * Find the invite record by either inviteToken or userId
       * Throw error if not found
       */
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

      try {
        /**
         * Add user to household and update invite status to ACCEPTED
         */
        const inviteSuccess = await addSingleUserToHousehold(
          householdId,
          input.userId,
          ctx.db,
        );
        const acceptedAt = new Date();
        await ctx.db.householdInvite.update({
          where: { id: id },
          data: { status: "ACCEPTED", acceptedAt: acceptedAt },
        });
        return inviteSuccess;
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
    }),

  deleteUserFromHousehold: protectedProcedure
    .input(
      z.object({
        userToDeleteId: z.string().min(1),
        householdId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      
      const { userToDeleteId, householdId } = input;
      const { id } = ctx.session.user;
      // check that user exists
      const userIsMember = await ctx.db.householdUser.findUnique({
        where: {
          userId_householdId: {
            userId: userToDeleteId,
            householdId: householdId,
          },
        },
      });
      if (!userIsMember) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User with name ${input.userToDeleteId} not found`,
        });
      }
      const isHouseholdOwner = await checkUserIsOwnerOfHousehold(
        householdId,
        id,
        ctx.db,
      );
      if (isHouseholdOwner) {
        try {
          const result = ctx.db.householdUser.delete({
            where: {
              userId_householdId: {
                userId: userToDeleteId,
                householdId: householdId,
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
