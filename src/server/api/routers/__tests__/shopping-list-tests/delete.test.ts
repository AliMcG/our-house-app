import { describe, expect } from "@jest/globals";
import { Prisma } from "@prisma/client";
import { createMockTRPCContext } from "../../../../../../jest.setup";
import { fakeShoppingListComplete } from "../../../../../../types/fake-data";
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
    describe('Given the user is authenticated', () => {
      describe('And a shopping list with a known Id exists and is associated with a household', () => {
        describe('When the "delete" mutation is executed with the shopping list`s Id', () => {
          describe('Then the shopping list should be deleted', () => {
            test('And its association with the household should also be removed', async () => {
              const mockShoppingList = fakeShoppingListComplete()

              const mockDeleteContext = createMockTRPCContext<ShoppingListId>(mockCtx.prisma, { id: mockShoppingList.id });

              const deleteHouseholdShoppingListSpy = jest.spyOn(ctx.prisma.householdShoppingList, 'deleteMany');
              jest.spyOn(ctx.prisma.shoppingList, 'findUnique').mockResolvedValueOnce(mockShoppingList
              );
              const deleteShoppingListSpy = jest.spyOn(ctx.prisma.shoppingList, 'delete').mockResolvedValueOnce(mockShoppingList
              );

              const result = await shoppingListRouter.delete(mockDeleteContext)

              expect(result).toEqual(expect.objectContaining(mockShoppingList));

              expect(deleteHouseholdShoppingListSpy).toHaveBeenCalled()

              // Verify DB calls
              expect(deleteShoppingListSpy).toHaveBeenCalledWith({
                where: {
                  id: mockShoppingList.id,
                },
              });
            })
          })
        })
      })
    })
  })
  describe('Scenario: Attempt to delete a non-existent shopping list', () => {
    describe('Given the user is authenticated', () => {
      describe('And a non-existent shopping list Id is provided', () => {
        describe('When the "delete" mutation is executed with the non-existent list Id', () => {
          test('Then an error should be returned indicating that the shopping list was not found', async () => {
            const mockShoppingList = fakeShoppingListComplete()

            const mockDeleteContext = createMockTRPCContext<ShoppingListId>(mockCtx.prisma, { id: mockShoppingList.id });

            const deleteHouseholdShoppingListSpy = jest.spyOn(ctx.prisma.householdShoppingList, 'deleteMany');
            jest.spyOn(ctx.prisma.shoppingList, 'findUnique').mockResolvedValueOnce(null
            );
            const deleteShoppingListSpy = jest.spyOn(ctx.prisma.shoppingList, 'delete')

            await expect(
              shoppingListRouter.delete(mockDeleteContext)
            ).rejects.toMatchObject({
              code: 'NOT_FOUND',
              message: 'Shopping list not found.',
            });

            expect(deleteHouseholdShoppingListSpy).not.toHaveBeenCalled()

            expect(deleteShoppingListSpy).not.toHaveBeenCalled();
          })
        })
      })
    })
  })
})
