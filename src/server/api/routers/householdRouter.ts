import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { addSingleUserToHousehold, checkUserIsOwnerOfHousehold } from "./apiHelperFunctions";
import { TRPCError } from "@trpc/server";

/**
 * household router handles routes to list, locate, edit and delete a household
 */
export const householdRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.household.findMany({
      where: {
        OR: [
          {
            createdBy: { id: ctx.session.user.id },
          },
          {
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        ],
      },
    });
  }),

  locate: protectedProcedure
    .input(z.object({ householdId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.household.findUnique({
        where: {
          id: input.householdId,
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const newHousehold = await ctx.db.household.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
          imageUrl: "",
        },
      });
      const addUser = await addSingleUserToHousehold(
        newHousehold.id,
        ctx.session.user.id,
        ctx.db,
      );
      return { newHousehold: newHousehold, addedUser: addUser };
    }),

  delete: protectedProcedure
    .input(z.object({ householdId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const isHouseholeOwner = await checkUserIsOwnerOfHousehold(input.householdId, ctx.session.user.id, ctx.db)
      if (isHouseholeOwner) {
        try {
          const result = ctx.db.household.delete({
            where: {
              id: input.householdId,
            },
          });
          return result
        } catch (e) {
          console.log("error: ", e)
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Prisma error: `,
          });
        }
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: `You are not the owner of the household - no permission to delete`,
        });
      }
      return 
    }),
});
