import { test, expect, describe, it } from "@jest/globals"
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


describe("List", () => {
  const mockSession: Session = {
    expires: new Date().toISOString(),
    user: { id: process.env.UNIT_TESTER_ID as string },
  };
  const mockErrorSession: Session = {
    expires: new Date().toISOString(),
    user: { id: "No ID" },
  };
  
  it('List all shoppingLists', async () => {
  
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

  it("should throw an error if no user ID", async () => {
 
    const caller = createCaller(await createContextInner({session: mockErrorSession}));
    
    await expect(caller.shoppingList.list()).rejects.toThrow("ser not found")

  })
})

