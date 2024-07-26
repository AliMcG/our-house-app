import { postRouter } from "@/server/api/routers/post";
import { shoppingListRouter } from "@/server/api/routers/shoppingList";
import { shoppingListItemRouter } from "./routers/shoppingListItem";
import { choresRouter } from "./routers/chores";
import { choresItemRouter } from "./routers/choresItem";
import { createTRPCRouter, createCallerFactory } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  shoppingList: shoppingListRouter,
  shoppingListItem: shoppingListItemRouter,
  chores: choresRouter,
  choresItem: choresItemRouter,
});

export const createCaller = createCallerFactory(appRouter);
// export type definition of API
export type AppRouter = typeof appRouter;
