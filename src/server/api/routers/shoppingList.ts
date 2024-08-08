import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { findHouseholdsByUser } from "./apiHelperFunctions";
import { TRPCError } from "@trpc/server";

export const shoppingListRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const householdIds = await findHouseholdsByUser(
      ctx.session.user.id,
      ctx.db,
    );
    if (!ctx.session.user.id) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User is undefined",
      });
    }

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
