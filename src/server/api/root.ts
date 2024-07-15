import { postRouter } from "@/server/api/routers/post";
import { householdRouter } from "@/server/api/routers/householdRouter";
import { shoppingListRouter } from "@/server/api/routers/shoppingList";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  householdRouter: householdRouter,
  post: postRouter,
  shoppingList: shoppingListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
