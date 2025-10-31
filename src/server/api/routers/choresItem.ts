import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { ObjectId } from "bson";


export const choresItemRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ listId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      if (ObjectId.isValid(ctx.session.user.id)) {
        try {
          return await ctx.db.choresItem.findMany({
            where: {
              choresId: input.listId
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
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), listId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.choresItem.create({
        data: {
          active: true,
          name: input.name,
          completedBy: null,
          Chores: { connect: { id: input.listId } },
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