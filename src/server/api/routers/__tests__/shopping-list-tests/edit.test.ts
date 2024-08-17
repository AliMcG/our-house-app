import { describe, it, expect } from "@jest/globals";
import { createContextInner } from "@/server/api/trpc";
import { createCaller } from "@/server/api/root";
import { mockSession } from "../../utils/testHelpers";
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

describe("Editing a list", () => {
  const editDate = new Date();
  const input = {
    id: process.env.UNIT_TEST_LIST_ID as string,
    title: `UNIT TEST LIST EDITED - ${editDate.toLocaleDateString()}`,
  };
  const invalidTitleInput = {
    id: process.env.UNIT_TEST_LIST_ID as string,
    title: "",
  };
  const invalidIdInput = {
    id: faker.database.mongodbObjectId(),
    title: "Invalid ID",
  };

  it("edits a shoppingList", async () => {
    const caller = createCaller(
      await createContextInner({ session: mockSession }),
    );
    const editedShoppingList = await caller.shoppingList.edit(input);

    expect(editedShoppingList).toHaveProperty("title", input.title);
    expect(editedShoppingList).toHaveProperty("id");
  });

  it("should throw an error when passed invalid title input", async () => {
    const caller = createCaller(
      await createContextInner({ session: mockSession }),
    );

    await expect(caller.shoppingList.edit(invalidTitleInput)).rejects.toThrow(
      "Title can not be blank",
    );
  });
  it("should throw an error when passed an invalid shoppingList ID", async () => {
    const caller = createCaller(
      await createContextInner({ session: mockSession }),
    );
    await expect(caller.shoppingList.edit(invalidIdInput)).rejects.toThrow(
      "Shopping list not found",
    );
  });
});
