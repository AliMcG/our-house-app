
import { fakeHouseholdComplete, fakeHouseholdShoppingListComplete, fakeShoppingListComplete } from "../../../../../../types/fake-data";
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
export type HouseholdShoppingListHouseholdId = Prisma.HouseholdShoppingListGetPayload<{
  select: {
    householdId: true,
  }
}>
export type AddShoppingListToHousehold = ShoppingListId & HouseholdShoppingListHouseholdId

describe('Feature: ShoppingList API - Add Shopping List To Household', () => {
  let mockCtx: MockContext
  let ctx: Context

  beforeAll(async () => {
    mockCtx = createMockContext()
    ctx = mockCtx
  })

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Scenario: Successfully add an existing shopping list to a household", () => {
    describe('Given the user is authenticated', () => {
      describe('And a shopping list with a known Id exists', () => {
        describe('And a household with a known Id exists', () => {
          describe('And the shopping list is not already associated with the household', () => {
            describe('When the "addShoppingListToHousehold" mutation is executed with the list Id and household Id', () => {
              test("Then the shopping list should be successfully associated with the household", async () => {

                const mockShoppingList = fakeShoppingListComplete()
                const mockHousehold = fakeHouseholdComplete()
                const mockHouseholdShoppingList = fakeHouseholdShoppingListComplete()

                const mockCreateContext = createMockTRPCContext<AddShoppingListToHousehold>(mockCtx.prisma, { id: mockShoppingList.id, householdId: mockHousehold.id });

                const linkShoppingListToHouseholdSpy = jest.spyOn(ctx.prisma.householdShoppingList, 'create').mockResolvedValueOnce(mockHouseholdShoppingList);

                const result = await shoppingListRouter.addShoppingListToHousehold(mockCreateContext)

                expect(result).toStrictEqual(true);

                expect(linkShoppingListToHouseholdSpy).toHaveBeenCalledWith({
                  data: {
                    householdId: mockHousehold.id,
                    shoppingListId: mockShoppingList.id,
                  },
                });
              });
            })
          })
        })
      })
    })
  });
});
