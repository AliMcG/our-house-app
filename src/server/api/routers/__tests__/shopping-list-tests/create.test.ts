import { describe, expect } from "@jest/globals";
import { createContextInner } from "@/server/api/trpc";
import { createCaller } from "@/server/api/root";
import { mockErrorSessionNoID, mockSession } from "../../utils/testHelpers";
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
beforeAll(async () => {
  const ctx = await createContextInner({ session: mockSession });
  caller = createCaller(ctx);
  const invalidCtx = await createContextInner({ session: mockErrorSessionNoID });
  inValidCaller = createCaller(invalidCtx)
  newListId = ""
});
const input = { title: "UNIT TEST CREATE NEW LIST", householdId: 'household-1', };


describe("Feature: Creating a shopping list", () => {
  describe('Scenario: invalid user', () => {
    describe('Given an invalid user is trying to create a shopping list', () => {
      test('Then a error should be thrown', async () => {
        await expect(inValidCaller.shoppingList.create(input)).rejects.toThrow(
          "User is undefined",
        );
      })
      test('And the error should be a TRPCError', async () => {
        expect.assertions(2)
        try {
          await inValidCaller.shoppingList.create(input)
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
    describe('Given an invalid request to create a shopping list', () => {
      describe('And the "title" is an empty string', () => {
        const invalidInput = { title: "", householdId: 'household-1', };
        test('Then a error should be thrown', async () => {
          await expect(caller.shoppingList.create(invalidInput)).rejects.toThrow(
            "Title can not be blank",
          );
        })
        test('And the error should be a TRPCError', async () => {
          expect.assertions(1)
          try {
            await caller.shoppingList.create(invalidInput)
          } catch (error) {
            expect(error).toBeInstanceOf(TRPCError)
          }
        })
      })
    })
  })
  describe('Scenario: Successfully creates shopping list', () => {
    describe('Given that the user and input are valid', () => {
      describe('When the create method is called', () => {
        afterAll(async () => {
          await caller.shoppingList.delete({ id: newListId });
        })
        test('Then success must be true', async () => {
          const newShoppingList = await caller.shoppingList.create(input);
          newListId = newShoppingList.shoppingListId
          expect(newShoppingList).toHaveProperty("title", input.title);
          expect(newShoppingList).toHaveProperty("id");
          expect(newShoppingList).toHaveProperty("createdById", mockSession.user.id);
        })
      })
    })
  })
});
