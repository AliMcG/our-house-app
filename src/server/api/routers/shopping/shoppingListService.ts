import { Prisma, type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export type HouseholdUser = Prisma.HouseholdGetPayload<{
    select: { id: true }
}>

export type ShoppingListWithItems = Prisma.ShoppingListGetPayload<{
    include: {
        items: true,
        _count: true
    }
}>

export type ShoppingList = Prisma.ShoppingListGetPayload<undefined>



export const findShoppingListsByUserIdAndHouseholds = async (
    db: PrismaClient,
    userId: string,
    householdIds: string[]
): Promise<ShoppingListWithItems[]> => {
    return db.shoppingList.findMany({
        where: {
            OR: [
                // Case 1: Shopping lists created by the current user
                { createdById: userId },
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
            _count: true,
        },
    });
};


/**
 * Retrieves the IDs of all households that a specific user is a member of.
 *
 * This function queries the database to find all households where the given
 * `userId` is listed as a member and returns only their IDs.
 *
 * @param {PrismaClient} db - The Prisma Client instance for database interactions.
 * @param {string} userId - The ID of the user for whom to retrieve households.
 * @returns An array of household ids.
 * Returns an empty array if the user is not a member of any households or if no households are found.
 *
 * @example
 * ```ts
 * const prisma = new PrismaClient();
 * const userId = 'user-123';
 * try {
 *   const householdIds = await getUserHouseholdIds(prisma, userId);
 *   console.log('User belongs to household IDs:', householdIds);
 *   // Example output:
 *   // User belongs to household IDs: [ 'household-abc', 'household-def' ]
 * } catch (error) {
 *   console.error('Failed to get user household IDs:', error);
 * }
 * ```
 */
export const getUserHouseholdIds = async (db: PrismaClient, userId: string): Promise<string[]> => {
    const households = await db.household.findMany({
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

    // Map the result to an array of just the IDs
    return households.map((household) => household.id);
};

/**
 * Creates a link between an existing shopping list and a household.
 *
 * This function assumes a shopping list already exists and creates a new record
 * in the `householdShoppingList` table to associate the given `shoppingListId`
 * with the specified `householdId`. It returns true upon successful creation
 * of this association.
 *
 * @param {PrismaClient} db - The Prisma Client instance for database interactions.
 * @param {string} householdId - The ID of the household to associate the shopping list with.
 * @param {string} shoppingListId - The ID of the shopping list to associate with the household.
 * @returns {Promise<boolean>} A promise that resolves to true if the association was created successfully.
 * Returns false if any error occurs during the process.
 *
 * @example
 * ```ts
 * const prisma = new PrismaClient();
 * const householdId = 'household-abc';
 * const shoppingListId = 'shopping-list-xyz';
 * try {
 *   const success = await linkShoppingListToHousehold(prisma, householdId, shoppingListId);
 *   if (success) {
 *     console.log(`Shopping list ${shoppingListId} linked to household ${householdId} successfully.`);
 *   } else {
 *     console.error(`Failed to link shopping list ${shoppingListId} to household ${householdId}.`);
 *   }
 * } catch (error) {
 *   console.error('An unexpected error occurred:', error);
 * }
 * ```
 */
export const linkShoppingListToHousehold = async (db: PrismaClient, householdId: string, shoppingListId: string): Promise<boolean> => {
    try {
        const linkedShoppingList = await db.householdShoppingList.create({
            data: {
                householdId: householdId,
                shoppingListId: shoppingListId,
            },
        });
        return linkedShoppingList ? true : false
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: 'Error linking shopping list to household:',
            cause: error
        });
    }
};