import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { ObjectId } from "bson";


export const shoppingListItemRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ listId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      if (ObjectId.isValid(ctx.session.user.id)) {
        const listFound = await ctx.db.shoppingList.findUnique({
          where: { id: input.listId },
        });
        if (listFound) {
          try {
            return await ctx.db.shoppingItem.findMany({
              where: {
                shoppingListId: listFound.id
              }
            });
          } catch (err) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to retrieve shopping list item",
            });
          }
        } else {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "strange, list id not found",
          });
        }

      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is undefined",
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