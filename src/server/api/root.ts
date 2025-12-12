import { householdRouter } from "@/server/api/routers/household/householdRouter";
import { shoppingListRouter } from "@/server/api/routers/shopping/shoppingList";
import { shoppingListItemRouter } from "./routers/shopping/shoppingListItem";
import { choresRouter } from "./routers/chores";
import { choresItemRouter } from "./routers/choresItem";
import { householdUserRouter } from "./routers/householdUser/householdUserRouter"
import { createTRPCRouter, createCallerFactory } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  householdRouter: householdRouter,
  householdUserRouter: householdUserRouter,
  shoppingList: shoppingListRouter,
  shoppingListItem: shoppingListItemRouter,
  chores: choresRouter,
  choresItem: choresItemRouter,
});

export const createCaller = createCallerFactory(appRouter);
// export type definition of API
export type AppRouter = typeof appRouter;
