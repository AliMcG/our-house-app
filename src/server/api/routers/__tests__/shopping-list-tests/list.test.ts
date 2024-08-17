import { expect, describe, it } from "@jest/globals";
import { createContextInner } from "@/server/api/trpc";
import { createCaller } from "@/server/api/root";
import {
  mockErrorSessionNoID,
  mockErrorSessionUnknownID,
  mockSession,
} from "../testHelpers";
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
