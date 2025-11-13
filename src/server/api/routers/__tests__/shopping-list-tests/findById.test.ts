import { describe, expect } from "@jest/globals";
import { createMockTRPCContext } from "../../../../../../jest.setup";
import { fakeShoppingListComplete } from "../../../../../../types/fake-data";
import { Context, createMockContext, MockContext } from '../../../../context';
import { shoppingListRouter } from "../../shopping/shoppingList";
import { ShoppingListId } from "./delete.test";

describe('Feature: ShoppingList API Find By Id', () => {
  let mockCtx: MockContext
  let ctx: Context

  beforeAll(async () => {
    mockCtx = createMockContext()
    ctx = mockCtx
  })

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Scenario: Successfully retrieve a specific shopping list by its Id", () => {
    describe('Given the user is authenticated', () => {
      describe('And a shopping list with a known Id exists', () => {
        describe("When the 'findById' query is executed with the shopping list's Id", () => {
          test("Then the response should contain the details of the specified shopping list", async () => {

            const mockShoppingList = fakeShoppingListComplete()

            const mockContext = createMockTRPCContext<ShoppingListId>(mockCtx.prisma, { id: mockShoppingList.id })

            const findManyShoppingList = jest.spyOn(ctx.prisma.shoppingList, 'findUnique').mockResolvedValueOnce(mockShoppingList);

            const shoppingListFound = await shoppingListRouter.findById(mockContext);

            expect(shoppingListFound).toStrictEqual(expect.objectContaining(mockShoppingList));

            expect(findManyShoppingList).toHaveBeenCalledWith({
              where: { id: mockShoppingList.id }
            });
          });
        })
      })
    })
  })
  describe("Scenario: Attempt to retrieve a non-existent shopping list", () => {
    describe("Given the user is authenticated", () => {
      describe("And a shopping list with a non-existent Id is provided", () => {
        describe("When the 'findById' query is executed with the non-existent Id", () => {
          test("Then the response should indicate that the shopping list was not found", async () => {

            const mockShoppingList = fakeShoppingListComplete()

            const mockContext = createMockTRPCContext<ShoppingListId>(mockCtx.prisma, { id: mockShoppingList.id })

            const findManyShoppingList = jest.spyOn(ctx.prisma.shoppingList, 'findUnique').mockResolvedValueOnce(null);

            const shoppingListFound = await shoppingListRouter.findById(mockContext);

            expect(shoppingListFound).toStrictEqual(null);

            expect(findManyShoppingList).toHaveBeenCalledWith({
              where: { id: mockShoppingList.id }
            });
          })
        })
      })
    })
  })
})
