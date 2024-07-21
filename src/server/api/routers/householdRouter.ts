import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";

/**
 * Seperate reusable database logic to own functions to avoid creating new context
 * re docs = https://trpc.io/docs/server/server-side-calls
 */
const findUserByEmail = async (userEmail: string, prismaCtx: PrismaClient) => {
  const userId = await prismaCtx.user.findUnique({
    where: {
      email: userEmail
    }
  })
  return userId?.id
}
const addSingleUserToHousehold = async (householdId: string, userId: string, prismaCtx: PrismaClient) => {
  const addedUser = await prismaCtx.householdUser.create({
    data: {
      userId: userId,
      householdId: householdId
    }
  })
  return addedUser
}

export const householdRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.household.findMany({
      where: {
        createdBy: { id: ctx.session.user.id },
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
      const addUser = await addSingleUserToHousehold(newHousehold.id, ctx.session.user.id, ctx.db)
      return { newHousehold: newHousehold, addedUser: addUser }
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
