import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { HouseholdUser } from "@prisma/client";

const member: HouseholdUser = {
  id: "",
  userId: "",
  householdId: "",
};

export const householdRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.household.findMany({
      where: {
        createdBy: { id: ctx.session.user.id },
      },
    });
  }),
  locate: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.household.findMany({
        where: {
          name: input.name,
          createdBy: { id: ctx.session.user.id },
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.household.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
          imageUrl: "",
          // members: [member]
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.household.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
