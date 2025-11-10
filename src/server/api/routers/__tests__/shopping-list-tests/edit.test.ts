import { fakeHouseholdComplete, fakeHouseholdShoppingListComplete, fakeShoppingListComplete } from "../../../../../../types/fake-data";
import { describe, expect } from "@jest/globals";
import { Prisma } from "@prisma/client";
import { createMockTRPCContext, mockSession } from "../../../../../../jest.setup";
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
  describe('Scenario: Successfully edits shopping list', () => {
    describe('Given that the user and input are valid', () => {
      describe('When the edit method is called', () => {
        test('Then success must be true', async () => {
          const mockShoppingList = fakeShoppingListComplete()
          mockShoppingList.createdById = mockSession.user.id;
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

          expect(result).toEqual(expect.objectContaining(mockShoppingList));

        })
      })
    })
  })
})
