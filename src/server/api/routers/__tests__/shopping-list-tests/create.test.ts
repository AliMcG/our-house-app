
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
  describe("Scenario: Successfully creates a shopping list", () => {
    describe('Given that the user is valid and the input is valid', () => {
      describe('When the create method is called', () => {
        describe('Then it creates a new shopping list', () => {
          test("And it creates a relationship with a household", async () => {

            const mockShoppingList = fakeShoppingListComplete()
            mockShoppingList.createdById = mockSession.user.id;
            const mockHousehold = fakeHouseholdComplete()
            const mockHouseholdShoppingList = fakeHouseholdShoppingListComplete()

            const mockCreateContext = createMockTRPCContext<ShoppingListCreate>(mockCtx.prisma, { title: mockShoppingList.title, householdId: mockHousehold.id });

            jest.spyOn(ctx.prisma.householdShoppingList, 'create').mockResolvedValueOnce(mockHouseholdShoppingList);
            jest.spyOn(ctx.prisma.shoppingList, 'create').mockResolvedValueOnce(mockShoppingList
            );

            const result = await shoppingListRouter.create(mockCreateContext)

            expect(result).toEqual(expect.objectContaining(mockShoppingList));

            // Verify DB calls
            expect(ctx.prisma.shoppingList.create).toHaveBeenCalledWith({
              data: {
                title: mockShoppingList.title,
                createdBy: { connect: { id: mockSession.user.id } }

              },
            });
            expect(ctx.prisma.householdShoppingList.create).toHaveBeenCalledWith({
              data: {
                householdId: mockHousehold.id,
                shoppingListId: mockShoppingList.id,
              },
            });
          });
        })
      })
    })
  });
});
