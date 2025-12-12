import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { ObjectId } from "bson";

/**
 * Separate reusable database logic to own functions to avoid creating new context
 * re docs = https://trpc.io/docs/server/server-side-calls
 */


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


export const findHouseholdsByUser = async (
  userId: string,
  prismaCtx: PrismaClient,
) => {

  if (ObjectId.isValid(userId)) {
    try {
      const householdUserRecords = await prismaCtx.householdUser.findMany({
        where: {
          userId: userId,
        },
        select: {
          householdId: true,
        },
      });
      const householdIds = householdUserRecords.map(
        (record) => record.householdId,
      );
      return householdIds;
    } catch (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No households found for this user",
        cause: error,
      });
    }
  } else {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is undefined",
    });
  }
};
