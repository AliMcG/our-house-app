import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const choresRouter = createTRPCRouter({
  list: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.chores.findMany({
        where: {
          createdBy: { id: ctx.session.user.id }
        }
      });
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
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.chores.delete({
        where: {
          id: input.id
        }
      });
    }),
});