import { describe, expect } from "@jest/globals";
import { createMockTRPCContext } from "../../../../../../jest.setup";
import { fakeHouseholdComplete, fakeHouseholdShoppingListComplete, fakeShoppingItemComplete, fakeShoppingListComplete } from "../../../../../../types/fake-data";
import { Context, createMockContext, MockContext } from '../../../../context';
import { shoppingListItemRouter } from "../../shopping/shoppingListItem";
import { Prisma } from "@prisma/client";

export type ShoppingListId = Prisma.ShoppingItemGetPayload<{
  select: {
    shoppingListId: true
  }
}>

describe('Feature: Shopping Item API - List', () => {
  let mockCtx: MockContext
  let ctx: Context

  beforeAll(async () => {
    mockCtx = createMockContext()
    ctx = mockCtx
  })

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Scenario: Successfully retrieve all items for a specific shopping list", () => {
    describe('Given that the user is authenticated', () => {
      describe('And a shopping list with a known Id exists', () => {
        describe('And shopping items exist within that shopping list', () => {
          describe('When the "list" query is executed with the shopping list`s Id', () => {
            test("Then the response should contain all shopping items associated with the specified shopping list", async () => {

              const mockShoppingList = fakeShoppingListComplete()
              const mockShoppingItems = [fakeShoppingItemComplete(), fakeShoppingItemComplete()]
              const mockHousehold = fakeHouseholdComplete()
              const mockHouseholdShoppingList = fakeHouseholdShoppingListComplete()

              const mockContext = createMockTRPCContext<ShoppingListId>(mockCtx.prisma, { shoppingListId: mockShoppingList.id });

              jest.spyOn(ctx.prisma.shoppingList, 'findUnique').mockResolvedValueOnce(mockShoppingList);
              jest.spyOn(ctx.prisma.household, 'findMany').mockResolvedValueOnce([mockHousehold]);
              jest.spyOn(ctx.prisma.householdShoppingList, 'findFirst').mockResolvedValueOnce(mockHouseholdShoppingList);
              jest.spyOn(ctx.prisma.shoppingItem, 'findMany').mockResolvedValueOnce(mockShoppingItems);

              const response = await shoppingListItemRouter.list(mockContext);

              expect(Array.isArray(response)).toBe(true);
              expect(response).toHaveLength(2);
            });
          })
        })
      })
    })
  })
  describe("Scenario: Attempt to retrieve items for a specific shopping list", () => {
    describe('Given that the user is authenticated', () => {
      describe('And a shopping list with a known Id exists', () => {
        describe('And there are no shopping items exist within that shopping list', () => {
          describe('When the "list" query is executed with with the shopping list`s Id', () => {
            test("TThen the response should be an empty array", async () => {

              const mockShoppingList = fakeShoppingListComplete()
              const mockHousehold = fakeHouseholdComplete()
              const mockHouseholdShoppingList = fakeHouseholdShoppingListComplete()

              const mockContext = createMockTRPCContext<ShoppingListId>(mockCtx.prisma, { shoppingListId: mockShoppingList.id });

              jest.spyOn(ctx.prisma.shoppingList, 'findUnique').mockResolvedValueOnce(mockShoppingList);
              jest.spyOn(ctx.prisma.household, 'findMany').mockResolvedValueOnce([mockHousehold]);
              jest.spyOn(ctx.prisma.householdShoppingList, 'findFirst').mockResolvedValueOnce(mockHouseholdShoppingList);
              jest.spyOn(ctx.prisma.shoppingItem, 'findMany').mockResolvedValueOnce([]);

              const response = await shoppingListItemRouter.list(mockContext);

              expect(Array.isArray(response)).toBe(true);

              expect(response).toHaveLength(0);
            });
          })
        })
      })
    })
  })
  describe("Scenario: Attempt to retrieve items for a non-existent shopping list", () => {
    describe('Given that the user is authenticated', () => {
      describe('And a non-existent shopping list Id is provided', () => {
        describe('And shopping items exist within that shopping list', () => {
          describe('When the "list" query is executed with the non-existent shopping list Id', () => {
            test("Then an error should be returned indicating that the shopping list was not found", async () => {

              const mockShoppingList = fakeShoppingListComplete()
              const mockContext = createMockTRPCContext<ShoppingListId>(mockCtx.prisma, { shoppingListId: mockShoppingList.id });

              jest.spyOn(ctx.prisma.shoppingList, 'findUnique').mockResolvedValueOnce(null);
              const itemsSpy = jest.spyOn(ctx.prisma.shoppingItem, 'findMany')

              await expect(
                shoppingListItemRouter.list(mockContext)
              ).rejects.toMatchObject({
                code: 'NOT_FOUND',
                message: 'Shopping list not found.',
              });

              expect(itemsSpy).not.toHaveBeenCalled();
            });
          })
        })
      })
    })
  })
})
