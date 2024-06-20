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
});