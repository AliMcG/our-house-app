import { fakeShoppingListComplete } from "../../../../../../types/fake-data";
import { describe, expect } from "@jest/globals";
import { Prisma } from "@prisma/client";
import { createMockTRPCContext, mockSession } from "../../../../../../jest.setup";
import { Context, createMockContext, MockContext } from '../../../../context';
import { shoppingListRouter } from "../../shopping/shoppingList";

export type ShoppingListId = Prisma.ShoppingListGetPayload<{
  select: {
    id: true
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
  describe('Scenario: Successfully deletes shopping list', () => {
    describe('Given that the user and input are valid', () => {
      describe('When the delete method is called', () => {
        test('Then success must be true', async () => {
          const mockShoppingList = fakeShoppingListComplete()
          mockShoppingList.createdById = mockSession.user.id;

          const mockDeleteContext = createMockTRPCContext<ShoppingListId>(mockCtx.prisma, { id: mockShoppingList.id });

          const deleteSpy = jest.spyOn(ctx.prisma.householdShoppingList, 'deleteMany');
          jest.spyOn(ctx.prisma.shoppingList, 'findUnique').mockResolvedValueOnce(mockShoppingList
          );
          jest.spyOn(ctx.prisma.shoppingList, 'delete').mockResolvedValueOnce(mockShoppingList
          );

          const result = await shoppingListRouter.delete(mockDeleteContext)

          expect(result).toEqual(expect.objectContaining(mockShoppingList));

          expect(deleteSpy).toHaveBeenCalled()
        })
      })
    })
  })
})
