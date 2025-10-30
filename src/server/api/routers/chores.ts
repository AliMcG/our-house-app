import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { ObjectId } from "bson";

export const choresRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.chores.findMany({
      where: {
        createdBy: { id: ctx.session.user.id },
      },
    });
  }),
  findById: protectedProcedure.input(z.object({ listId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      if (ObjectId.isValid(ctx.session.user.id)) {
        try {
          return await ctx.db.chores.findUnique({
            where: { id: input.listId },
          });

        } catch (error) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Failed to retrieve shopping list item",
            cause: error
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
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.chores.create({
        data: {
          title: input.title,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  edit: protectedProcedure
    .input(z.object({ id: z.string().min(1), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.chores.update({
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
      return ctx.db.chores.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
