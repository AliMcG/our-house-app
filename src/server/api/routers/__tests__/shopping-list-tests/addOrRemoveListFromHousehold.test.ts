import { expect, describe, beforeAll } from "@jest/globals";
import { createContextInner } from "@/server/api/trpc";
import { createCaller } from "@/server/api/root";
import { faker } from "@faker-js/faker";
import { mockSession } from "../../utils/testHelpers";
import dotenv from "dotenv";

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

beforeAll(async () => {
  caller = createCaller(await createContextInner({ session: mockSession }));
});

describe("Feature: Managing a Shopping List by Household", () => {
  describe("Scenario: Deleting a shopping list from a household", () => {
    describe("When deleting a shopping list", () => {
      describe("If the shopping list does not exist", () => {
        test("Then an error should be thrown", async () => {
          const input = {
            id: faker.database.mongodbObjectId(),
            householdId: process.env.UNIT_TEST_HOUSEHOLD_ID as string,
          };
          await expect(
            caller.shoppingList.removeShoppingListFromHousehold(input),
          ).rejects.toThrow("Failed to remove shopping list from household");
        });
      })
      describe("If neither the shopping list nor the the household exist", () => {
        test("Then an error should be thrown", async () => {
          const input = {
            id: faker.database.mongodbObjectId(),
            householdId: faker.database.mongodbObjectId(),
          };
          await expect(
            caller.shoppingList.removeShoppingListFromHousehold(input),
          ).rejects.toThrow("Failed to remove shopping list from household");
        });
      })
      describe("If the shopping list exists", () => {
        beforeAll(async () => {
          const input = {
            id: process.env.UNIT_TEST_LIST_ID as string,
            householdId: process.env.UNIT_TEST_HOUSEHOLD_ID as string,
          };
          await caller.shoppingList.addShoppingListToHousehold(input);
        })
        test("Then it should be deleted from the household", async () => {
          const input = {
            id: process.env.UNIT_TEST_LIST_ID as string,
            householdId: process.env.UNIT_TEST_HOUSEHOLD_ID as string,
          };
          const removedShoppingListFromHousehold =
            await caller.shoppingList.removeShoppingListFromHousehold(input);

          expect(removedShoppingListFromHousehold).toHaveProperty("id", input.id);
          expect(removedShoppingListFromHousehold.sharedHouseholds).not.toContain(
            input.householdId,
          );
        })
      })
    });
    describe("Scenario: Adding a shopping list to a household", () => {
      describe("When adding a shopping list to a household", () => {
        describe("And the list already exists in the household", () => {
          beforeAll(async () => {
            const input = {
              id: process.env.UNIT_TEST_LIST_ID as string,
              householdId: process.env.UNIT_TEST_HOUSEHOLD_ID as string,
            };
            await caller.shoppingList.addShoppingListToHousehold(input);
          })
          afterAll(async () => {
            const input = {
              id: process.env.UNIT_TEST_LIST_ID as string,
              householdId: process.env.UNIT_TEST_HOUSEHOLD_ID as string,
            };
            await caller.shoppingList.removeShoppingListFromHousehold(input);
          })
          test("Then it should throw an error", async () => {
            const input = {
              id: process.env.UNIT_TEST_LIST_ID as string,
              householdId: process.env.UNIT_TEST_HOUSEHOLD_ID as string,
            };
            await expect(
              caller.shoppingList.addShoppingListToHousehold(input),
            ).rejects.toThrow("Shopping list already added to household");
          });
        })
        describe("And the list can be added", () => {
          afterAll(async () => {
            const input = {
              id: process.env.UNIT_TEST_LIST_ID as string,
              householdId: process.env.UNIT_TEST_HOUSEHOLD_ID as string,
            };
            await caller.shoppingList.removeShoppingListFromHousehold(input);
          })
          test("Then it should add a shopping list to a household", async () => {
            const caller = createCaller(
              await createContextInner({ session: mockSession }),
            );
            const input = {
              id: process.env.UNIT_TEST_LIST_ID as string,
              householdId: process.env.UNIT_TEST_HOUSEHOLD_ID as string,
            };

            const updatedShoppingList =
              await caller.shoppingList.addShoppingListToHousehold(input);

            expect(updatedShoppingList).toHaveProperty("id", input.id);
            expect(updatedShoppingList.sharedHouseholds).toContain(input.householdId);
          });
        })
      })
    })
  })
});
