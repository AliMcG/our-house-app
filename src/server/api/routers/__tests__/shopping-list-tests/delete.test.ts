import { describe, it, expect } from "@jest/globals";
import { createContextInner } from "@/server/api/trpc";
import { createCaller } from "@/server/api/root";
import { mockErrorSessionNoID, mockSession } from "../../utils/testHelpers";
import { TRPCError } from "@trpc/server";
import { faker } from "@faker-js/faker";

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
const input = { title: "UNIT TEST DELETE NEW LIST" };
beforeAll(async () => {
  const ctx = await createContextInner({ session: mockSession });
  caller = createCaller(ctx);
  const invalidCtx = await createContextInner({ session: mockErrorSessionNoID });
  inValidCaller = createCaller(invalidCtx)
});
describe("Feature: Deleting a shopping list", () => {
  describe('Scenario: invalid user', () => {
    beforeAll(async () => {
      const shoppingListToDelete = await caller.shoppingList.create(input);
      newListId = shoppingListToDelete.id
    })
    afterAll(async () => {
      await caller.shoppingList.delete({ id: newListId });
    })
    describe('Given an invalid user is trying to create a shopping list', () => {
      test('Then a error should be thrown', async () => {
        await expect(inValidCaller.shoppingList.delete({ id: newListId })).rejects.toThrow(
          "User is undefined",
        );
      })
      test('And the error should be a TRPCError', async () => {
        expect.assertions(2)
        try {
          await inValidCaller.shoppingList.delete({ id: newListId })
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError)
          if (error instanceof TRPCError) {
            expect(error.code).toStrictEqual("UNAUTHORIZED")
          }
        }
      })
    })
  })
  describe('Scenario: invalid input', () => {
    beforeAll(async () => {
      const shoppingListToDelete = await caller.shoppingList.create(input);
      newListId = shoppingListToDelete.id
    })
    afterAll(async () => {
      await caller.shoppingList.delete({ id: newListId });
    })
    describe('Given an invalid request to delete a shopping list', () => {
      describe('And the "id" is an empty string', () => {
        test('Then a error should be thrown', async () => {
          await expect(caller.shoppingList.delete({ id: "" })).rejects.toThrow(
            "Select a list to delete",
          );
        })
        test('And the error should be a TRPCError', async () => {
          expect.assertions(1)
          try {
            await caller.shoppingList.delete({ id: "" })
          } catch (error) {
            expect(error).toBeInstanceOf(TRPCError)
          }
        })
      })
    })
  })
  describe('Scenario: Shopping list does not exist', () => {
    describe('Given an id request to delete a shopping list', () => {
      describe('And the "id" does not exist', () => {
        test('Then a error should be thrown', async () => {
          await expect(caller.shoppingList.delete({ id: faker.database.mongodbObjectId() })).rejects.toThrow(
            "Shopping list not found",
          );
        })
        test('And the error should be a TRPCError', async () => {
          expect.assertions(2)
          try {
            await caller.shoppingList.delete({ id: faker.database.mongodbObjectId() })
          } catch (error) {
            expect(error).toBeInstanceOf(TRPCError)
            if (error instanceof TRPCError) {
              expect(error.code).toStrictEqual("NOT_FOUND")
            }
          }
        })
      })
    })
  })
  describe('Scenario: Successfully deletes shopping list', () => {
    describe('Given that the user and input are valid', () => {
      describe('When the delete method is called', () => {
        beforeAll(async () => {
          const shoppingListToDelete = await caller.shoppingList.create(input);
          newListId = shoppingListToDelete.id
        })
        test('Then success must be true', async () => {
          const deletedShoppingList = await caller.shoppingList.delete({ id: newListId });
          expect(deletedShoppingList).toHaveProperty("title", input.title);
          expect(deletedShoppingList).toHaveProperty("id");
          expect(deletedShoppingList).toHaveProperty("createdById", mockSession.user.id);
        })
      })
    })
  })
});
