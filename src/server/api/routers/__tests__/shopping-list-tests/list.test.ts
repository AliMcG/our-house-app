import { expect, describe, it } from "@jest/globals";
import { createContextInner } from "@/server/api/trpc";
import { createCaller } from "@/server/api/root";
import { faker } from "@faker-js/faker";
import { mockErrorSessionNoID, mockErrorSessionUnknownID, mockSession } from "../testHelpers";
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

describe("ShoppingList Routes", () => {
 

  describe("the list route", () => {
    it("lists all shoppingLists", async () => {
      const caller = createCaller(
        await createContextInner({ session: mockSession }),
      );

      const shoppingLists = await caller.shoppingList.list();

      expect(Array.isArray(shoppingLists)).toBe(true);
      shoppingLists.forEach((list) => {
        expect(typeof list).toBe("object");
        expect(list).toHaveProperty("id");
        expect(list).toHaveProperty("title");
        expect(list).toHaveProperty("createdAt");
        expect(list).toHaveProperty("updatedAt");
      });
    });

    it("should throw an error if no user ID", async () => {
      const caller = createCaller(
        await createContextInner({ session: mockErrorSessionNoID }),
      );
      await expect(caller.shoppingList.list()).rejects.toThrow(
        "User is undefined",
      );
    });

    it("should return an empty array if no households for this user.", async () => {
      const caller = createCaller(
        await createContextInner({ session: mockErrorSessionUnknownID }),
      );

      const shoppingLists = await caller.shoppingList.list();
      expect(Array.isArray(shoppingLists)).toBe(true);
      expect(shoppingLists).toHaveLength(0);
    });
  });

  describe("addShoppingListToHousehold", () => {
    it("should throw an error when trying add an unknown shopping list to an unknown household", async () => {
      const caller = createCaller(
        await createContextInner({ session: mockSession }),
      );
      const input = {
        id: faker.database.mongodbObjectId(),
        householdId: faker.database.mongodbObjectId(),
      };

      await expect(
        caller.shoppingList.addShoppingListToHousehold(input),
      ).rejects.toThrow("Failed to create shopping list");
    });

    it("should add a shopping list to a household", async () => {
      const caller = createCaller(
        await createContextInner({ session: mockSession }),
      );
      const input = {
        id: process.env.UNIT_TEST_LIST_ID as string,
        householdId: process.env.UNIT_TEST_HOUSEHOLD_ID as string,
      };

      const updatedShoppingList = await caller.shoppingList.addShoppingListToHousehold(input);
      console.log("updatedShoppingList", updatedShoppingList)

      expect(updatedShoppingList).toHaveProperty("id", input.id);
      expect(updatedShoppingList.sharedHouseholds).toContain(input.householdId);

      // updatedShoppingList {
      //   id: '66bfb8d126711ca3bbcdfa9d',
      //   title: 'UNIT TEST LIST',
      //   createdAt: 2024-08-16T20:38:41.448Z,
      //   updatedAt: 2024-08-16T20:58:18.123Z,
      //   sharedHouseholds: [ '66bfb9c226711ca3bbcdfa9e' ],
      //   createdById: '660f0be784746dc5ad2f00e2'
      // }
    });
  });
});
