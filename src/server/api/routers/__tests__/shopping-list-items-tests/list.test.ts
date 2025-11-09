import { describe, expect } from "@jest/globals";
import { createMockTRPCContext } from "../../../../../../jest.setup";
import { fakeShoppingItemComplete, fakeShoppingListComplete } from "../../../../../../types/fake-data";
import { Context, createMockContext, MockContext } from '../../../../context';
import { shoppingListItemRouter } from "../../shopping/shoppingListItem";
import { Prisma } from "@prisma/client";

export type ShoppingListId = Prisma.ShoppingItemGetPayload<{
  select: {
    shoppingListId: true
  }
}>

describe('Feature: ShoppingList API', () => {
  let mockCtx: MockContext
  let ctx: Context

  beforeAll(async () => {
    mockCtx = createMockContext()
    ctx = mockCtx
  })

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Scenario: Successfully lists shopping list items", () => {
    describe('Given that the user is valid and that lists exist', () => {
      describe('When the List method is called', () => {
        test("It should return all the shopping lists", async () => {

          const mockShoppingList = fakeShoppingListComplete()
          const mockShoppingItems = [fakeShoppingItemComplete(), fakeShoppingItemComplete()]

          const mockContext = createMockTRPCContext<ShoppingListId>(mockCtx.prisma, { shoppingListId: mockShoppingList.id });

          jest.spyOn(ctx.prisma.shoppingList, 'findUnique').mockResolvedValueOnce(mockShoppingList);
          jest.spyOn(ctx.prisma.shoppingItem, 'findMany').mockResolvedValueOnce(mockShoppingItems);

          const shoppingItems = await shoppingListItemRouter.list(mockContext);

          expect(Array.isArray(shoppingItems)).toBe(true);
          expect(shoppingItems).toHaveLength(2);
        });
      })
    })
  })
})
