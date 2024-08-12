import { test, expect } from "@jest/globals"
import { createContextInner } from '@/server/api/trpc';
import { createCaller } from '@/server/api/root';
import type { Session } from "next-auth";
import dotenv from 'dotenv';
dotenv.config()

/**
 * These modules required mocking for Jest to work.
 */
jest.mock("superjson", () => ({
  superjson: jest.fn()
}))
jest.mock("@/env", () => ({
  env: jest.fn(),
 }))
 jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
 }))

test('Create a new shoppingList', async () => {
  const mockSession: Session = {
    expires: new Date().toISOString(),
    user: { id: process.env.UNIT_TESTER_ID as string },
  };
  const input = { title: "UNIT TEST SHOPPING LIST" }

  const caller = createCaller(await createContextInner({session: mockSession}));

  const newShoppingList = await caller.shoppingList.create(input)

  expect(newShoppingList).toHaveProperty("title", input.title);
  expect(newShoppingList).toHaveProperty("id");
  expect(newShoppingList).toHaveProperty("createdById", mockSession.user.id);
});
