import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const checkUserIsOwnerOfHousehold = async (
    householdId: string,
    userId: string,
    prismaCtx: PrismaClient,
) => {
    if (!householdId || !userId) {
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
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Error checking ownership",
            cause: error,
        });
    }
};