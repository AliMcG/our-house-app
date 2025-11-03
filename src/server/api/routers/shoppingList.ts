import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { ObjectId } from "bson";

export const shoppingListRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ObjectId.isValid(ctx.session.user.id)) {
      const userId = ctx.session.user.id;

      // 1. Find households the current user belongs to
      const userHouseholds = await ctx.db.household.findMany({
        where: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
        select: {
          id: true,
        },
      });

      const householdIds = userHouseholds.map((household) => household.id);

      try {
        return await ctx.db.shoppingList.findMany({
          where: {
            OR: [
              // Case 1: Shopping lists created by the current user
              {
                createdById: userId,
              },
              // Case 2: Shopping lists shared with the user's households
              {
                householdEntries: {
                  some: {
                    householdId: {
                      in: householdIds,
                    },
                  },
                },
              },
            ],
          },
          // The include key word allows us to fetch related data in a single query
          // TODO review which relations are actually needed here to optimize performance
          // It might be that we need to create separate endpoints for different use cases
          include: {
            items: true,
            _count: true
          }
        })
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve shopping lists",
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
  findById: protectedProcedure.input(z.object({ listId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      if (ObjectId.isValid(ctx.session.user.id)) {
        try {
          return await ctx.db.shoppingList.findUnique({
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

  addShoppingListToHousehold: protectedProcedure
    .input(z.object({ id: z.string().min(1), householdId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.householdShoppingList.create({
          data: {
            householdId: input.householdId,
            shoppingListId: input.id,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add shopping list to household",
        });
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, { message: "Title can not be blank" }),
        householdId: z.string().min(1)
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ObjectId.isValid(ctx.session?.user?.id)) {
        try {
          const newShoppingList = await ctx.db.shoppingList.create({
            data: {
              title: input.title,
              createdBy: { connect: { id: ctx.session.user.id } }

            },
          });
          const updatedHouseholds = await ctx.db.householdShoppingList.create({
            data: {
              householdId: input.householdId,
              shoppingListId: newShoppingList.id,
            },
          });

          return { success: !updatedHouseholds, shoppingListId: newShoppingList.id };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create shopping list",
          });
        }
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is undefined",
        });
      }
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Select a list to edit" }),
        title: z.string().min(1, { message: "Title can not be blank" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ObjectId.isValid(ctx.session?.user?.id)) {
        const shoppingList = await ctx.db.shoppingList.findUnique({
          where: { id: input.id },
        });
        if (shoppingList) {
          try {
            return await ctx.db.shoppingList.update({
              where: {
                id: input.id,
              },
              data: {
                title: input.title,
              },
            });
          } catch (error) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to update shopping list",
            });
          }
        } else {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Shopping list not found",
          });
        }
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is undefined",
        });
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Select a list to delete" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ObjectId.isValid(ctx.session?.user?.id)) {
        const shoppingList = await ctx.db.shoppingList.findUnique({
          where: { id: input.id },
        });
        if (shoppingList) {
          try {
            // 1. Delete the corresponding entries in the HouseholdShoppingList join table
            // We need to delete each entry where shoppingListId matches the input.id
            await ctx.db.householdShoppingList.deleteMany({
              where: {
                shoppingListId: input.id,
              },
            });

            // 2. Delete the ShoppingList itself
            const deletedShoppingList = await ctx.db.shoppingList.delete({
              where: {
                id: input.id,
              },
            });

            return deletedShoppingList;
          } catch (error) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to delete shopping list",
            });
          }
        } else {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Shopping list not found",
          });
        }
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is undefined",
        });
      }
    }),
});
