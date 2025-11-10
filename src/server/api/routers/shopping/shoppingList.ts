import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { findShoppingListsByUserIdAndHouseholds, getUserHouseholdIds, linkShoppingListToHousehold } from "./shoppingListService";

export const shoppingListRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const db = ctx.db;
    try {
      // 1. Find households the current user belongs to
      const householdIds = await getUserHouseholdIds(db, userId);

      // 2. Find shopping lists based on user and households
      const shoppingLists = await findShoppingListsByUserIdAndHouseholds(
        db,
        userId,
        householdIds
      );
      return shoppingLists;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve shopping lists",
        cause: error
      });
    }
  }),
  findById: protectedProcedure.input(z.object({ listId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.shoppingList.findUnique({
          where: { id: input.listId },
        });

      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Failed to retrieve the shopping list",
          cause: error
        });
      }
    }),

  /**
   * This method is required if a user wants to share a shopping list with additional households.
   * Regular shopping list creation will add the shopping list to current household
   */
  addShoppingListToHousehold: protectedProcedure
    .input(z.object({ id: z.string().min(1), householdId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db;
      const householdId = input.householdId;
      const shoppingListId = input.id
      try {
        return await linkShoppingListToHousehold(db, householdId, shoppingListId)
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add shopping list to household",
        });
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, { message: "Title can not be blank" }),
        householdId: z.string().min(1)
      }),
    )
    .output(z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      createdAt: z.date(),
      updatedAt: z.date(),
      createdById: z.string().min(1)
    }),)
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db;
      try {
        const newShoppingList = await db.shoppingList.create({
          data: {
            title: input.title,
            createdBy: { connect: { id: ctx.session.user.id } }

          },
        });
        await linkShoppingListToHousehold(db, input.householdId, newShoppingList.id)

        return newShoppingList;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create shopping list",
        });
      }
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Select a list to edit" }),
        title: z.string().min(1, { message: "Title can not be blank" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      try {
        const listFound = await ctx.db.shoppingList.findUnique({
          where: { id: input.id },
        });
        if (!listFound) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Shopping list not found.",
          });
        }
        // Authorization Check: Ensure the user has access to this list
        const householdIds = await getUserHouseholdIds(ctx.db, userId);
        // Check the join table
        const isUserInListHousehold = await ctx.db.householdShoppingList.findFirst({
          where: {
            shoppingListId: listFound.id,
            householdId: { in: householdIds }
          }
        });
        if (!isUserInListHousehold) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to update this shopping list.",
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
    .input(
      z.object({
        id: z.string().min(1, { message: "Select a list to delete" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const listFound = await ctx.db.shoppingList.findUnique({
          where: { id: input.id },
        });
        if (!listFound) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Shopping list not found.",
          });
        }
        // 1. Delete the corresponding entries in the HouseholdShoppingList join table
        // We need to delete each entry where shoppingListId matches the input.id
        await ctx.db.householdShoppingList.deleteMany({
          where: {
            shoppingListId: input.id,
          },
        });

        // 2. Delete the ShoppingList itself
        const deletedShoppingList = await ctx.db.shoppingList.delete({
          where: {
            id: input.id,
          },
        });
        return deletedShoppingList;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete shopping list",
          cause: error
        });
      }
    }),
});
