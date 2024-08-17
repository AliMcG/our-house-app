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
    try {
      return await ctx.db.shoppingList.findMany({
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
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve shopping lists",
      });
    }
  }),

  addShoppingListToHousehold: protectedProcedure
    .input(z.object({ id: z.string().min(1), householdId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const shoppingList = await ctx.db.shoppingList.findUnique({
        where: { id: input.id },
        select: { sharedHouseholds: true },
      });
      if (shoppingList?.sharedHouseholds.includes(input.householdId)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Shopping list already added to household",
        });
      }
      try {
        return await ctx.db.shoppingList.update({
          where: {
            id: input.id,
          },
          data: {
            sharedHouseholds: {
              push: input.householdId,
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add shopping list to household",
        });
      }
    }),

  removeShoppingListFromHousehold: protectedProcedure
    .input(z.object({ id: z.string().min(1), householdId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const shoppingList = await ctx.db.shoppingList.findUnique({
          where: { id: input.id },
          select: { sharedHouseholds: true },
        });

        if (!shoppingList) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Shopping list not found",
          });
        }

        // Remove the householdId from sharedHouseholds array
        const updatedHouseholds = shoppingList.sharedHouseholds.filter(
          (household) => household !== input.householdId,
        );

        // Update the shopping list
        return await ctx.db.shoppingList.update({
          where: {
            id: input.id,
          },
          data: {
            sharedHouseholds: updatedHouseholds,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove shopping list from household",
        });
      }
    }),

  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authenticated",
        });
      }
      try {
        return await ctx.db.shoppingList.create({
          data: {
            title: input.title,
            createdBy: { connect: { id: ctx.session.user.id } },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create shopping list",
        });
      }
    }),

  edit: protectedProcedure
    .input(z.object({ id: z.string().min(1), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const shoppingList = await ctx.db.shoppingList.findUnique({
          where: { id: input.id },
        });

        if (!shoppingList) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Shopping list not found",
          });
        }

        return await ctx.db.shoppingList.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update shopping list",
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const shoppingList = await ctx.db.shoppingList.findUnique({
          where: { id: input.id },
        });

        if (!shoppingList) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Shopping list not found",
          });
        }

        return await ctx.db.shoppingList.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete shopping list",
        });
      }
    }),
});
