import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

type listItemType = { 
  id: string;
  name: string;
  quantity: number;
  active: boolean;
  shoppingListId: string | null;
}


export const shoppingListItemRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      // fetching shopping list by its name as we expect uniqueness between households
      // stores empty array or a list of items
      let listItems: [] | listItemType[] = [];
      const listFound = await ctx.db.shoppingList.findFirst({
        where: {
          title: input.title,
        }
      });
      // look for the list items
      if (listFound !== null) {
        listItems = await ctx.db.shoppingItem.findMany({
          where: {
            shoppingListId: listFound.id
          }
        });
      }
      // return the list of items or null if the list was not found
      return listItems.length === 0 ? 'items not found' : listItems;
    }),
});