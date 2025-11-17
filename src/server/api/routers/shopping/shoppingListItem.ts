import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getUserHouseholdIds } from "./shoppingListService";


export const shoppingListItemRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ shoppingListId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const listFound = await ctx.db.shoppingList.findUnique({
        where: { id: input.shoppingListId },
      });
      if (!listFound) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shopping list not found.",
        });
      }
      try {
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
            message: "You do not have permission to view this shopping list.",
          });
        }
        return await ctx.db.shoppingItem.findMany({
          where: {
            shoppingListId: listFound.id
          }
        });
      } catch (err) {
        console.error("Error in shoppingListItemRouter.list:", err);
        if (err instanceof TRPCError) {
          throw err;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `An unexpected error occurred while retrieving shopping list items for id: ${input.shoppingListId}`,
        });
      }

    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), listId: z.string().min(1), quantity: z.number().int().min(1).max(99) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.shoppingItem.create({
        data: {
          active: true,
          name: input.name,
          quantity: input.quantity,
          ShoppingList: { connect: { id: input.listId } },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.shoppingItem.delete({
        where: {
          id: input.id
        }
      });
    }),

  // TODO does this need to be a separate method or should we just use an standard 
  // edit /update method to handle all edits to an item
  updateActive: protectedProcedure
    .input(z.object({ id: z.string().min(1), active: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { id, active } = input;
      const updateRecord = await ctx.db.shoppingItem.update({
        where: { id },
        data: { active }
      });
      return updateRecord
    }),
});