import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";

/**
 * Seperate reusable database logic to own functions to avoid creating new context
 * re docs = https://trpc.io/docs/server/server-side-calls
 */
const findHouseholdsByUser = async (
  userId: string,
  prismaCtx: PrismaClient,
) => {
  const householdUserRecords = await prismaCtx.householdUser.findMany({
    where: {
      userId: userId,
    },
    select: {
      householdId: true,
    },
  });
  const householdIds = householdUserRecords.map((record) => record.householdId);
  return householdIds;
};

export const shoppingListRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const householdIds = await findHouseholdsByUser(
      ctx.session.user.id,
      ctx.db,
    );
    return ctx.db.shoppingList.findMany({
      where: {
        OR: [
          {
            createdBy: { id: ctx.session.user.id },
          },
          {
            sharedHouseholds: { hasSome: householdIds },
          },
        ],
      },
    });
  }),

  addToHousehold: protectedProcedure
    .input(z.object({ id: z.string().min(1), householdId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.shoppingList.update({
        where: {
          id: input.id,
        },
        data: {
          sharedHouseholds: {
            push: input.householdId,
          },
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.shoppingList.create({
        data: {
          title: input.title,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  edit: protectedProcedure
    .input(z.object({ id: z.string().min(1), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.shoppingList.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.shoppingList.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
