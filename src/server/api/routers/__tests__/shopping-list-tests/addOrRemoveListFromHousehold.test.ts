import { expect, describe, it } from "@jest/globals";
import { createContextInner } from "@/server/api/trpc";
import { createCaller } from "@/server/api/root";
import { faker } from "@faker-js/faker";
import { mockSession } from "../testHelpers";
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

describe("add and remove a Shopping List from a Household", () => {
  it("should throw an error when adding an unknown shopping list to an unknown household", async () => {
    const caller = createCaller(
      await createContextInner({ session: mockSession }),
    );
    const input = {
      id: faker.database.mongodbObjectId(),
      householdId: faker.database.mongodbObjectId(),
    };

    await expect(
      caller.shoppingList.addShoppingListToHousehold(input),
    ).rejects.toThrow("Failed to add shopping list to household");
  });

  it("should add a shopping list to a household", async () => {
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

  it("should throw an error if the list has already been added to a household", async () => {
    const caller = createCaller(
      await createContextInner({ session: mockSession }),
    );
    const input = {
      id: process.env.UNIT_TEST_LIST_ID as string,
      householdId: process.env.UNIT_TEST_HOUSEHOLD_ID as string,
    };
    await expect(
      caller.shoppingList.addShoppingListToHousehold(input),
    ).rejects.toThrow("Shopping list already added to household");
  });

  it("should remove a shopping list from a household", async () => {
    const caller = createCaller(
      await createContextInner({ session: mockSession }),
    );
    const input = {
      id: process.env.UNIT_TEST_LIST_ID as string,
      householdId: process.env.UNIT_TEST_HOUSEHOLD_ID as string,
    };
    const removedShoppinglistFromHousehold =
      await caller.shoppingList.removeShoppingListFromHousehold(input);

    expect(removedShoppinglistFromHousehold).toHaveProperty("id", input.id);
    expect(removedShoppinglistFromHousehold.sharedHouseholds).not.toContain(
      input.householdId,
    );
  });
});
