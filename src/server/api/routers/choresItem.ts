import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import type { ChoresListItemResponseType } from "@/types/index";
import { TRPCError } from "@trpc/server";
import { ObjectId } from "bson";


export const choresItemRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      if (ObjectId.isValid(ctx.session.user.id)) {
        // will be used to store custom response.
        // let response: ChoresListItemResponseType = { status: 'list not found' };
        // fetching chores by their name as we expect uniqueness between households
        const listFound = await ctx.db.chores.findFirst({
          where: {
            title: input.title,
          }
        });

        if (listFound) {
          try {
            return await ctx.db.choresItem.findMany({
              where: {
                choresId: listFound.id
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
        })
        // if (listFound.id) {
        //   const items = await ctx.db.choresItem.findMany({
        //     where: {
        //       choresId: listFound.id
        //     }
        //   });
        //   // finally check if the items were found
        //   response = items.length === 0
        //     ? { items, listID: listFound.id, status: 'list items not found' }
        //     : { items, listID: listFound.id, status: 'list items found' }
        // }else{
        //   response = { status: 'strange, list id not found' } 
        // }
      }
      // lets return the response
      // return response;
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), listID: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.choresItem.create({
        data: {
          active: true,
          name: input.name,
          completedBy: null,
          Chores: { connect: { id: input.listID } },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.choresItem.delete({
        where: {
          id: input.id
        }
      });
    }),
  // TODO: THIS NEEDS TO REMOVE USER ID WHEN ACTIVE AND ADD ID WHEN NOT ACTIVE
  updateActive: protectedProcedure
    .input(z.object({ id: z.string().min(1), active: z.boolean(), completedBy: z.nullable(z.string().min(1)) }))
    .mutation(async ({ ctx, input }) => {
      const { id, active } = input;
      const updateRecord = await ctx.db.choresItem.update({
        where: { id },
        data: { active, completedBy: input.completedBy }
      });
      return updateRecord;
    }),
});