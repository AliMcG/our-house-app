import { describe, expect } from "@jest/globals";
import { createContextInner } from "@/server/api/trpc";
import { createCaller } from "@/server/api/root";
import { mockErrorSessionNoID, mockSession } from "../../utils/testHelpers";
import { faker } from "@faker-js/faker";
import { TRPCError } from "@trpc/server";

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
  title: `UNIT TEST SHOPPING LIST: Edit - ${editDate.toLocaleDateString()}`,
  householdId: 'household-1',
};
const invalidTitleInput = {
  id: process.env.UNIT_TEST_LIST_ID as string,
  title: "",
  householdId: 'household-1',
};
const invalidIdInput = {
  id: faker.database.mongodbObjectId(),
  title: "Invalid ID",
  householdId: 'household-1',
};

beforeAll(async () => {
  caller = createCaller(await createContextInner({ session: mockSession }));
  inValidCaller = createCaller(await createContextInner({ session: mockErrorSessionNoID }))
  const shoppingListToDelete = await caller.shoppingList.create(input);
  newListId = shoppingListToDelete.shoppingListId
});
afterAll(async () => {
  await caller.shoppingList.delete({ id: newListId })
});

describe('Feature: Editing a shopping list', () => {
  describe('Scenario: invalid user', () => {
    describe('Given an invalid user is trying to edit a shopping list', () => {
      test('Then a error should be thrown', async () => {
        await expect(inValidCaller.shoppingList.edit({
          id: newListId,
          title: `UNIT TEST SHOPPING LIST: Edit - ${editDate.toLocaleDateString()}`,
        })).rejects.toThrow(
          "User is undefined",
        );
      })
      test('And the error should be a TRPCError', async () => {
        expect.assertions(2)
        try {
          await inValidCaller.shoppingList.edit({
            id: newListId,
            title: `UNIT TEST SHOPPING LIST: Edit - ${editDate.toLocaleDateString()}`,
          })
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError)
          if (error instanceof TRPCError) {
            expect(error.code).toStrictEqual("UNAUTHORIZED")
          }
        }
      })
    })
  })
  describe('Scenario: Shopping list does not exist', () => {
    describe('Given an invalid request to delete a shopping list', () => {
      describe('And the shoppingList ID is invalid', () => {
        test('Then a error should be thrown', async () => {
          await expect(caller.shoppingList.edit(invalidIdInput)).rejects.toThrow(
            "Shopping list not found",
          );
        })
        test('And the error should be a TRPCError', async () => {
          expect.assertions(1)
          try {
            await expect(caller.shoppingList.edit(invalidIdInput)).rejects.toThrow(
              "Shopping list not found",
            );
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
  describe('Scenario: Invalid input', () => {
    describe('And the shoppingList title input is invalid', () => {
      test('Then a error should be thrown', async () => {
        await expect(caller.shoppingList.edit(invalidTitleInput)).rejects.toThrow(
          "Title can not be blank",
        );
      })
      test('And the error should be a TRPCError', async () => {
        expect.assertions(2)
        try {
          await caller.shoppingList.edit(invalidIdInput)
        } catch (error) {
          expect(error).toBeInstanceOf(TRPCError)
          if (error instanceof TRPCError) {
            expect(error.code).toStrictEqual("NOT_FOUND")
          }
        }
      })
    })
  })
  describe('Scenario: Successfully edits shopping list', () => {
    describe('Given that the user and input are valid', () => {
      describe('When the edit method is called', () => {
        test('Then success must be true', async () => {
          const editedShoppingList = await caller.shoppingList.edit({
            id: newListId,
            title: `UNIT TEST SHOPPING LIST: Edit - ${editDate.toLocaleDateString()}`,
          });
          expect(editedShoppingList).toHaveProperty("title", input.title);
          expect(editedShoppingList).toHaveProperty("id");
        })
      })
    })
  })
})
