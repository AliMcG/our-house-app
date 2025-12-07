import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { addSingleUserToHousehold } from "../apiHelperFunctions";
import { TRPCError } from "@trpc/server";
import { checkUserIsOwnerOfHousehold } from "./householdService";

/**
 * household router handles routes to list, locate, create, edit and delete a household.
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
      // The include key word allows us to fetch related data in a single query
      // TODO review which relations are actually needed here to optimize performance
      // It might be that we need to create separate endpoints for different use cases
      include: {
        createdBy: true,
        members: {
          include: {
            user: true,
          },
        },
        chores: true,
        shoppingLists: {
          include: {
            shoppingList: {
              include: {
                _count: true,
              },
            },
          },
        },
        userInvites: {
          include: {
            inviterUser: true,
          },
        },
      },
    });
  }),

  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const { id } = input;
      return ctx.db.household.findUnique({
        where: {
          id: id,
        },
        include: {
          createdBy: true,
          members: {
            select: {
              user: true,
            },
          },
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
          imageUrl: ctx.session.user.image ?? "",
        },
      });
      const addUser = await addSingleUserToHousehold(
        newHousehold.id,
        ctx.session.user.id,
        ctx.db,
      );
      return { newHousehold: newHousehold, addedUser: addUser };
    }),

  edit: protectedProcedure
    .input(z.object({ name: z.string().min(1), householdId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const isHouseholdOwner = await checkUserIsOwnerOfHousehold(
        input.householdId,
        ctx.session.user.id,
        ctx.db,
      );
      if (isHouseholdOwner) {
        try {
          const result = ctx.db.household.update({
            where: {
              id: input.householdId,
            },
            data: {
              name: input.name,
            },
          });
          return result;
        } catch (e) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Household not found - not updated`,
          });
        }
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You are not the owner of the household - no permission to edit`,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ householdId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const isHouseholdOwner = await checkUserIsOwnerOfHousehold(
        input.householdId,
        ctx.session.user.id,
        ctx.db,
      );
      if (isHouseholdOwner) {
        try {
          const result = ctx.db.household.delete({
            where: {
              id: input.householdId,
            },
          });
          return result;
        } catch (e) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Household not found - not deleted `,
          });
        }
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You are not the owner of the household - no permission to delete`,
        });
      }
    }),
});
