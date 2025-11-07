/**
 * This file is used to set up the testing environment before each test suite runs.
 * It is specified in the Jest configuration file (jest.config.ts) under the
 * `setupFilesAfterEnv` option.
 */
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { DeepMockProxy } from "jest-mock-extended";
import type { Session } from "next-auth";
import { ProcedureCallOptions } from "node_modules/@trpc/server/dist/core/internals/procedureBuilder";

dotenv.config();

/**
 * These modules required mocking for Jest to work.
 */
jest.mock("superjson", () => ({
    superjson: jest.fn(),
}));
jest.mock("@/env", () => ({
    env: jest.fn(),
}));
jest.mock("next-auth", () => ({
    getServerSession: jest.fn(),
}));


/**
 * Creates a mock TRPC context for testing purposes.
 * 
 * @template MockedInputType - The type of the input to be mocked.
 * @param {DeepMockProxy<PrismaClient>} prismaMock - The mock Prisma client instance to use in the context.
 * @param {MockedInputType} [input] - Optional input - used if the router method has an input value.
 * @example
 * ```ts
 * interface ShoppingList {
 *      title: string;
 *      householdId: string;
 * };
 * const mockCreateContext = createMockTRPCContext<ShoppingList>({ title: 'New List', householdId: 'household-1' });
 * const result = await shoppingListRouter.create(mockCreateContext)
 * ```
 */
export const createMockTRPCContext = <MockedInputType>(prismaMock: DeepMockProxy<PrismaClient>, input?: MockedInputType): ProcedureCallOptions => {
    const mockContext: ProcedureCallOptions = {
        ctx: { db: prismaMock, session: mockSession, headers: new Headers(), },
        rawInput: input ? input : '',
        input: input ? input : '',
        path: 'string',
        type: input ? 'mutation' : 'query', // This does not seem to actually matter but makes nice semantic sense
    }
    return mockContext
}

/**
 * Reusable mockSession to use in db unit tests
 */
export const mockSession: Session = {
    expires: new Date().toISOString(),
    user: { id: faker.database.mongodbObjectId() },
};




