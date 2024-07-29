import { test, expect } from "@jest/globals"
import { env } from "@/env";
import { createContextInner } from '@/server/api/trpc';
import { createCaller } from '@/server/api/root';
import type { Session } from "next-auth";

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

test('List all shoppingLists', async () => {
  const mockSession: Session = {
    expires: new Date().toISOString(),
    user: { id: env.UNIT_TESTER_ID },
  };

  const caller = createCaller(await createContextInner({session: mockSession}));

  const shoppingLists = await caller.shoppingList.list()

  expect(Array.isArray(shoppingLists)).toBe(true);
  shoppingLists.forEach(list => {
    expect(typeof list).toBe('object');
    expect(list).toHaveProperty('id');
    expect(list).toHaveProperty('title');
    expect(list).toHaveProperty('createdAt');
    expect(list).toHaveProperty('updatedAt');
  });

});
