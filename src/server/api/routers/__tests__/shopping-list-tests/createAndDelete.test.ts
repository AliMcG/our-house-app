import { describe, it, expect } from "@jest/globals";
import { createContextInner } from "@/server/api/trpc";
import { createCaller } from "@/server/api/root";
import { mockErrorSessionNoID, mockSession } from "../../utils/testHelpers";

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

describe("Creating and deleting a list", () => {
  const input = { title: "UNIT TEST CREATE NEW LIST" };
  const invalidInput = { title: "" };
  let newListId = "";

  it("creates a new shoppingList", async () => {
    const caller = createCaller(
      await createContextInner({ session: mockSession }),
    );
    const newShoppingList = await caller.shoppingList.create(input);
    newListId = newShoppingList.id;
    expect(newShoppingList).toHaveProperty("title", input.title);
    expect(newShoppingList).toHaveProperty("id");
    expect(newShoppingList).toHaveProperty("createdById", mockSession.user.id);
  });

  it("should throw an error if no user ID", async () => {
    const caller = createCaller(
      await createContextInner({ session: mockErrorSessionNoID }),
    );
    await expect(caller.shoppingList.create(input)).rejects.toThrow(
      "User is undefined",
    );
  });

  it("should throw an error when passed invlaid input", async () => {
    const caller = createCaller(
      await createContextInner({ session: mockSession }),
    );

    await expect(caller.shoppingList.create(invalidInput)).rejects.toThrow(
      "Title can not be blank",
    );
  });
  it("deletes the newly created list", async () => {
    const caller = createCaller(
      await createContextInner({ session: mockSession }),
    );

    const deletedList = await caller.shoppingList.delete({ id: newListId });
    expect(deletedList).toHaveProperty("id", newListId);
  });
});
