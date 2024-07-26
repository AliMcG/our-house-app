import { test, expect } from "@jest/globals"
import { createContextInner, createTRPCContext } from '@/server/api/trpc';
import { createCaller } from '@/server/api/root';
import type { Session } from "next-auth";

/**
 * These modules required mocking for Jest to work.
 */
jest.mock("superjson", () => ({
  superjson: jest.fn()
}))
jest.mock("~/env", () => ({
  env: jest.fn(),
 }))
 jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
 }))

test('List all shoppingLists', async () => {
  const mockSession: Session = {
    expires: new Date().toISOString(),
    user: { id: "test-user" },
  };
 
  /**
   * createTRPCContext requires new Headers()
   */
  // const caller = createCaller(await createTRPCContext({ headers: new Headers() }));
  const caller = createCaller(await createContextInner());

  /**
   * The route for "hello" is a public route
   */
  const shoppingLists = await caller.post.hello({ text: "hi there"})
    /**
   * The route for "getSecretMessage" is a protected route
   */
  // const shoppingLists = await caller.post.getSecretMessage()
  console.log("shoppingLists", shoppingLists)

});
