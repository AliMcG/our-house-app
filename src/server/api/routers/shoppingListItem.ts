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

type ListItemResponseType = {
  items?: listItemType[];
  listID?: string;
  status: 'list items found' | 'list not found' | 'strange, list id not found' | 'list items not found';
}


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
      console.log("LIST FOUND55: ", listFound)
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
});