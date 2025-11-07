import { describe, expect } from "@jest/globals";
import { createMockTRPCContext, mockSession } from "../../../../../../jest.setup";
import { fakeHouseholdComplete, fakeShoppingListComplete } from "../../../../../../types/fake-data";
import { Context, createMockContext, MockContext } from '../../../../context';
import { shoppingListRouter } from "../../shopping/shoppingList";

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

  describe("Scenario: Successfully lists shopping lists", () => {
    describe('Given that the user is valid and that lists exist', () => {
      describe('When the List method is called', () => {
        test("It should return all the shopping lists", async () => {

          const mockShoppingLists = [fakeShoppingListComplete(), fakeShoppingListComplete()]
          const mockHousehold = fakeHouseholdComplete()

          const mockContext = createMockTRPCContext(mockCtx.prisma)

          jest.spyOn(mockCtx.prisma.household, 'findMany').mockResolvedValueOnce([mockHousehold]);
          jest.spyOn(mockCtx.prisma.shoppingList, 'findMany').mockResolvedValueOnce(mockShoppingLists);

          const shoppingLists = await shoppingListRouter.list(mockContext);

          expect(Array.isArray(shoppingLists)).toBe(true);
          expect(shoppingLists).toHaveLength(2);

          // Verify DB calls
          expect(mockCtx.prisma.household.findMany).toHaveBeenCalledWith({
            where: {
              members: {
                some: {
                  userId: mockSession.user.id,
                },
              },
            },
            select: {
              id: true,
            },
          });
          // shoppingList.findMany should be called with OR condition
          expect(mockCtx.prisma.shoppingList.findMany).toHaveBeenCalledWith({
            where: {
              OR: [
                { createdById: mockSession.user.id, },
                {
                  householdEntries: {
                    some: {
                      householdId: {
                        in: [mockHousehold.id],
                      },
                    },
                  },
                },
              ],
            },
            include: {
              items: true,
              _count: true,
            },
          });
        });
      })
    })
  })
})
