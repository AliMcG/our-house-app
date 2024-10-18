import { expect, describe } from "@jest/globals";
import { createContextInner } from "@/server/api/trpc";
import { createCaller } from "@/server/api/root";
import {
  mockErrorSessionNoID,
  mockErrorSessionUnknownID,
  mockSession,
} from "../../utils/testHelpers";
import dotenv from "dotenv";
import { TRPCError } from "@trpc/server";
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
let caller: ReturnType<typeof createCaller>;
let inValidCaller: ReturnType<typeof createCaller>;
let newListId: string;
const editDate = new Date();
const input = {
  title: `UNIT TEST SHOPPING LIST: List - ${editDate.toLocaleDateString()}`,
};

beforeAll(async () => {
  caller = createCaller(await createContextInner({ session: mockSession }));
  inValidCaller = createCaller(await createContextInner({ session: mockErrorSessionNoID }))
  const shoppingListToDelete = await caller.shoppingList.create(input);
  newListId = shoppingListToDelete.id
});
afterAll(async () => {
  await caller.shoppingList.delete({ id: newListId })
});

describe('Feature: List shopping lists', () => {
  describe('Scenario: invalid user', () => {
    describe('Given an invalid user is trying to list all shopping lists', () => {
      test('Then a error should be thrown', async () => {
        await expect(inValidCaller.shoppingList.list()).rejects.toThrow(
          "User is undefined",
        );
      })
      test('And the error should be a TRPCError', async () => {
        expect.assertions(2)
        try {
          await inValidCaller.shoppingList.list()
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError)
          if (error instanceof TRPCError) {
            expect(error.code).toStrictEqual("UNAUTHORIZED")
          }
        }
      })
    })
  })
  describe('Scenario: user has no shopping list', () => {
    describe('Given a valid user has no shopping lists', () => {
      describe('When the List method is called', () => {
        test("It should return an empty array", async () => {
          const caller = createCaller(
            await createContextInner({ session: mockErrorSessionUnknownID }),
          );
          const shoppingLists = await caller.shoppingList.list();
          expect(Array.isArray(shoppingLists)).toBe(true);
          expect(shoppingLists).toHaveLength(0);
        });
      })
    })
  })
  describe("Scenario: Successfully edits shopping list", () => {
    describe('Given that the user is valid and has access to some lists', () => {
      describe('When the List method is called', () => {
        test("It lists all shoppingLists", async () => {

          const shoppingLists = await caller.shoppingList.list();
      
          expect(Array.isArray(shoppingLists)).toBe(true);
          expect(shoppingLists.length).toBeGreaterThanOrEqual(1);
          shoppingLists.forEach((list) => {
            expect(typeof list).toBe("object");
            expect(list).toHaveProperty("id");
            expect(list).toHaveProperty("title");
            expect(list).toHaveProperty("createdAt");
            expect(list).toHaveProperty("updatedAt");
          });
        });
      })
    })
  });
})
