import { describe, expect } from "@jest/globals";
import { Prisma } from "@prisma/client";
import { createMockTRPCContext } from "../../../../../../jest.setup";
import { fakeHouseholdComplete, fakeHouseholdShoppingListComplete, fakeShoppingListComplete } from "../../../../../../types/fake-data";
import { Context, createMockContext, MockContext } from '../../../../context';
import { shoppingListRouter } from "../../shopping/shoppingList";

export type ShoppingListEdit = Prisma.ShoppingListGetPayload<{
  select: {
    id: true,
    title: true
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
  describe('Scenario: Successfully edit an existing shopping list`s title', () => {
    describe('Given the user is authenticated', () => {
      describe('And a shopping list with a known Id exists', () => {
        describe('When the "edit" mutation is executed with the list Id and a new title', () => {
          describe('Then the shopping list`s title should be updated to the new title', () => {
            test('And the response should contain the updated shopping list details', async () => {
              const mockShoppingList = fakeShoppingListComplete()
              const mockHousehold = fakeHouseholdComplete()
              const mockHouseholdShoppingList = fakeHouseholdShoppingListComplete()

              const mockEditContext = createMockTRPCContext<ShoppingListEdit>(mockCtx.prisma, { id: mockShoppingList.id, title: mockShoppingList.title });

              jest.spyOn(ctx.prisma.shoppingList, 'findUnique').mockResolvedValueOnce(mockShoppingList
              );
              jest.spyOn(ctx.prisma.household, 'findMany').mockResolvedValueOnce([mockHousehold]);
              jest.spyOn(ctx.prisma.householdShoppingList, 'findFirst').mockResolvedValueOnce(mockHouseholdShoppingList);
              jest.spyOn(ctx.prisma.shoppingList, 'update').mockResolvedValueOnce(mockShoppingList
              );

              const result = await shoppingListRouter.edit(mockEditContext)

              expect(result).toStrictEqual(expect.objectContaining(mockShoppingList));

              expect(ctx.prisma.shoppingList.update).toHaveBeenCalledWith({
                where: {
                  id: mockShoppingList.id,
                },
                data: {
                  title: mockShoppingList.title
                },
              });
            })
          })
        })
      })
    })
  })
  describe('Scenario: Attempt to edit a non-existent shopping list', () => {
    describe('Given the user is authenticated', () => {
      describe('And a non-existent shopping list Id is provided', () => {
        describe('When the "edit" mutation is executed with the non-existent list Id and a new title', () => {
          test('Then an error should be returned indicating that the shopping list was not found', async () => {
            const mockShoppingList = fakeShoppingListComplete()

            const mockEditContext = createMockTRPCContext<ShoppingListEdit>(mockCtx.prisma, { id: mockShoppingList.id, title: mockShoppingList.title });

            jest.spyOn(ctx.prisma.shoppingList, 'findUnique').mockResolvedValueOnce(null);

            const updateShoppingListSpy = jest.spyOn(ctx.prisma.shoppingList, 'update')

            await expect(
              shoppingListRouter.edit(mockEditContext)
            ).rejects.toMatchObject({
              code: 'NOT_FOUND',
              message: 'Shopping list not found.',
            });

            expect(updateShoppingListSpy).not.toHaveBeenCalled();
          })
        })
      })
    })
  })
})
