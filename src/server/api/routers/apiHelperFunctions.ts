import { type PrismaClient } from "@prisma/client";

/**
 * Seperate reusable database logic to own functions to avoid creating new context
 * re docs = https://trpc.io/docs/server/server-side-calls
 */

export const findUserByEmail = async (
  userEmail: string,
  prismaCtx: PrismaClient,
) => {
  const userId = await prismaCtx.user.findUnique({
    where: {
      email: userEmail,
    },
  });
  return userId?.id;
};
export const findHouseholdUserUniqueId = async (
  householdId: string,
  userId: string,
  prismaCtx: PrismaClient,
) => {
  const userToDelete = await prismaCtx.householdUser.findFirst({
    where: {
      householdId: householdId,
      userId: userId,
    },
  });
  return userToDelete?.id;
};
export const addSingleUserToHousehold = async (
  householdId: string,
  userId: string,
  prismaCtx: PrismaClient,
) => {
  const addedUser = await prismaCtx.householdUser.create({
    data: {
      userId: userId,
      householdId: householdId,
    },
  });
  return addedUser;
};
export const checkUserIsOwnerOfHousehold = async (
  householdId: string,
  userId: string,
  prismaCtx: PrismaClient,
) => {
  if (!householdId || !userId) {
    console.log("Invalid householdId or userId");
    return false;
  }
  try {
    const isOwner = await prismaCtx.household.findFirst({
      where: {
        id: householdId,
        createdById: userId,
      },
    });
    if (isOwner) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking ownership:", error);
    return false;
  }
};
