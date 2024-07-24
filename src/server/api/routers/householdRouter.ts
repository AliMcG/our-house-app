import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PrismaClient, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

/**
 * Seperate reusable database logic to own functions to avoid creating new context
 * re docs = https://trpc.io/docs/server/server-side-calls
 */
const findUserByEmail = async (userEmail: string, prismaCtx: PrismaClient) => {
  const userId = await prismaCtx.user.findUnique({
    where: {
      email: userEmail,
    },
  });
  return userId?.id;
};
const addSingleUserToHousehold = async (
  householdId: string,
  userId: string,
  prismaCtx: PrismaClient,
) => {
  const addedUser = await prismaCtx.householdUser.create({
    data: {
      userId: userId,
      householdId: householdId,
    },
  });
  return addedUser;
};

/**
 * Can create new household:
 * Can add creater to members of new household:
 * Can list all households - TODO review this functionality.
 * Can locate a household by ID
 * Can update a household to add a new member
 */

export const householdRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.household.findMany({
      where: {
        OR: [
          {
            createdBy: { id: ctx.session.user.id },
          },
          {
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        ],
      },
    });
  }),
  locate: protectedProcedure
    .input(z.object({ householdId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.household.findUnique({
        where: {
          id: input.householdId,
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const newHousehold = await ctx.db.household.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
          imageUrl: "",
          // members: [member]
        },
      });
      const addUser = await addSingleUserToHousehold(
        newHousehold.id,
        ctx.session.user.id,
        ctx.db,
      );
      return { newHousehold: newHousehold, addedUser: addUser };
    }),
  /**
   * Current assumption that the user to add is already a signed up user -
   * Future Feature to develop - send email request to completely new user.
   */
  updateHouseholdMembers: protectedProcedure
    .input(z.object({ householdId: z.string(), userEmail: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const newMemberId = await findUserByEmail(input.userEmail, ctx.db);
      if (!newMemberId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `User with email ${input.userEmail} not found`,
        });
      }
      try {
        const result = await addSingleUserToHousehold(
          input.householdId,
          newMemberId,
          ctx.db,
        );
        return result
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            console.log('There is a unique constraint violation, a new user cannot be created with this email')
            // TODO - this is not type safe on the front-end yet
            return {
              status: "error",
              field: "userEmail",
              message: "Email address already in use"
            }
          } else {
            console.log("e.code", e.code)
          }
        }
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.household.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
