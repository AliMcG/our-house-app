import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import type { ListItemResponseType } from "@/types/index";


export const shoppingListItemRouter = createTRPCRouter({
  list: protectedProcedure
  .input(z.object({ title: z.string().min(1) }))
  .query(async ({ ctx, input }) => {
    // will be used to store custom response.
    let response: ListItemResponseType = { status: 'list not found' };
    // fetching shopping list by its name as we expect uniqueness between households
    const listFound = await ctx.db.shoppingList.findFirst({
      where: {
        title: input.title,
      }
    });
    // only query the database futher if the list was found
    if (listFound !== null) {
      // the list must contain an id, otherwise something strange is happening
      if (listFound.id) {
        const items = await ctx.db.shoppingItem.findMany({
          where: {
            shoppingListId: listFound.id
          }
        });
        // finally check if the items were found
        response = items.length === 0
          ? { items, listID: listFound.id, status: 'list items not found' }
          : { items, listID: listFound.id, status: 'list items found' }
      }else{
        response = { status: 'strange, list id not found' } 
      }
    }
    // lets return the response
    return response;
  }),
  create: protectedProcedure
  .input(z.object({ name: z.string().min(1), listID: z.string().min(1), quantity: z.number().int().min(1).max(99) }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.shoppingItem.create({
      data: {
        active: true,
        name: input.name,
        quantity: input.quantity,
        ShoppingList: { connect: { id: input.listID } },
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