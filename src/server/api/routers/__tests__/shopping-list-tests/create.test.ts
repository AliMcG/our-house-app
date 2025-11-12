
import { fakeHouseholdComplete, fakeHouseholdShoppingListComplete, fakeShoppingListComplete } from "../../../../../../types/fake-data";
import { describe, expect } from "@jest/globals";
import { Prisma } from "@prisma/client";
import { createMockTRPCContext, mockSession } from "../../../../../../jest.setup";
import { Context, createMockContext, MockContext } from '../../../../context';
import { shoppingListRouter } from "../../shopping/shoppingList";

export type ShoppingListTitle = Prisma.ShoppingListGetPayload<{
  select: {
    title: true
  }
}>
export type HouseholdShoppingListHouseholdId = Prisma.HouseholdShoppingListGetPayload<{
  select: {
    householdId: true,
  }
}>
export type ShoppingListCreate = ShoppingListTitle & HouseholdShoppingListHouseholdId

describe('Feature: ShoppingList API - Create', () => {
  let mockCtx: MockContext
  let ctx: Context

  beforeAll(async () => {
    mockCtx = createMockContext()
    ctx = mockCtx
  })

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Scenario: Successfully create a new shopping list for a household", () => {
    describe('Given the user is authenticated', () => {
      describe('And a household with a known Id exists', () => {
        describe('When the "create" mutation is executed with a new list title and the household Id', () => {
          describe('Then a new shopping list should be created with the provided title', () => {
            describe('And the new shopping list should be associated with the specified household', () => {
              test("And the response should contain the details of the newly created shopping list", async () => {

                const mockShoppingList = fakeShoppingListComplete()
                const mockHousehold = fakeHouseholdComplete()
                const mockHouseholdShoppingList = fakeHouseholdShoppingListComplete()

                const mockCreateContext = createMockTRPCContext<ShoppingListCreate>(mockCtx.prisma, { title: mockShoppingList.title, householdId: mockHousehold.id });

                const createHouseholdShoppingListSpy = jest.spyOn(ctx.prisma.householdShoppingList, 'create').mockResolvedValueOnce(mockHouseholdShoppingList);
                const createShoppingListSpy = jest.spyOn(ctx.prisma.shoppingList, 'create').mockResolvedValueOnce(mockShoppingList
                );

                const result = await shoppingListRouter.create(mockCreateContext)

                expect(result).toEqual(expect.objectContaining(mockShoppingList));

                // Verify DB calls
                expect(createShoppingListSpy).toHaveBeenCalledWith({
                  data: {
                    title: mockShoppingList.title,
                    createdBy: { connect: { id: mockSession.user.id } }

                  },
                });
                expect(createHouseholdShoppingListSpy).toHaveBeenCalledWith({
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
