import { Prisma, type PrismaClient } from "@prisma/client";

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


// Function to get user's households
export const getUserHouseholds = async (db: PrismaClient, userId: string): Promise<HouseholdUser[]> => {
    return db.household.findMany({
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
};