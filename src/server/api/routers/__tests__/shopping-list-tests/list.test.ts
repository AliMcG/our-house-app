import { describe, expect } from "@jest/globals";
import { createMockTRPCContext, mockSession } from "../../../../../../jest.setup";
import { fakeHouseholdComplete, fakeShoppingListComplete } from "../../../../../../types/fake-data";
import { Context, createMockContext, MockContext } from '../../../../context';
import { shoppingListRouter } from "../../shopping/shoppingList";

describe('Feature: ShoppingList API List', () => {
  let mockCtx: MockContext
  let ctx: Context

  beforeAll(async () => {
    mockCtx = createMockContext()
    ctx = mockCtx
  })

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Scenario: Successfully list all shopping lists for a user", () => {
    describe('Given the user is authenticated', () => {
      describe('And the user belongs to one or more households', () => {
        describe("And shopping lists exist within those households", () => {
          describe("When the 'list' query is executed", () => {
            test("Then the response should contain all shopping lists associated with the user's households", async () => {

              const mockShoppingLists = [fakeShoppingListComplete(), fakeShoppingListComplete()]
              const mockHousehold = fakeHouseholdComplete()

              const mockContext = createMockTRPCContext(mockCtx.prisma)

              const findManyHouseholdSpy = jest.spyOn(ctx.prisma.household, 'findMany').mockResolvedValueOnce([mockHousehold]);
              const findManyShoppingList = jest.spyOn(ctx.prisma.shoppingList, 'findMany').mockResolvedValueOnce(mockShoppingLists);

              const shoppingLists = await shoppingListRouter.list(mockContext);

              expect(Array.isArray(shoppingLists)).toBe(true);
              expect(shoppingLists).toHaveLength(2);

              // Verify DB calls
              expect(findManyHouseholdSpy).toHaveBeenCalledWith({
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
              expect(findManyShoppingList).toHaveBeenCalledWith({
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
  })
  describe("Scenario: Successfully returns no shopping lists for a user", () => {
    describe("Given the user is authenticated", () => {
      describe("And the user belongs to one or more households", () => {
        describe("And there are no shopping lists exist for those households", () => {
          describe("When the 'list' query is executed", () => {
            test("Then the response should be an empty array", async () => {

              const mockHousehold = fakeHouseholdComplete()

              const mockContext = createMockTRPCContext(mockCtx.prisma)

              const findManyHouseholdSpy = jest.spyOn(ctx.prisma.household, 'findMany').mockResolvedValueOnce([mockHousehold]);
              const findManyShoppingList = jest.spyOn(ctx.prisma.shoppingList, 'findMany').mockResolvedValueOnce([]);

              const shoppingLists = await shoppingListRouter.list(mockContext);

              expect(Array.isArray(shoppingLists)).toBe(true);
              expect(shoppingLists).toHaveLength(0);

              // Verify DB calls
              expect(findManyHouseholdSpy).toHaveBeenCalledWith({
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
              expect(findManyShoppingList).toHaveBeenCalledWith({
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
            })
          })
        })
      })
    })
  })
  /** // TODO review:
   * Should this test even be possible? 
   * Currently it is possible for a user to create shopping lists but not be a member of any household.
   * Should household creation be mandatory? 
   * - AliMcG suspects that when a user first logs into the app they need to either create a household or have been added to one already.
   */
  describe("Scenario: Successfully shopping lists for a user without a household", () => {
    describe("Given the user is authenticated", () => {
      describe("And the user does not belong any households", () => {
        describe("And there are no shopping lists exist for those households", () => {
          describe("When the 'list' query is executed", () => {
            test("Then the response should contain all shopping lists associated with that user", async () => {

              const mockShoppingLists = [fakeShoppingListComplete(), fakeShoppingListComplete()]

              const mockContext = createMockTRPCContext(mockCtx.prisma)

              const findManyHouseholdSpy = jest.spyOn(ctx.prisma.household, 'findMany').mockResolvedValueOnce([]);
              const findManyShoppingList = jest.spyOn(ctx.prisma.shoppingList, 'findMany').mockResolvedValueOnce(mockShoppingLists);

              const shoppingLists = await shoppingListRouter.list(mockContext);

              expect(Array.isArray(shoppingLists)).toBe(true);
              expect(shoppingLists).toHaveLength(2);

              // Verify DB calls
              expect(findManyHouseholdSpy).toHaveBeenCalled();
              
              // shoppingList.findMany should be called with OR condition
              expect(findManyShoppingList).toHaveBeenCalledWith({
                where: {
                  OR: [
                    { createdById: mockSession.user.id, },
                    {
                      householdEntries: {
                        some: {
                          householdId: {
                            in: [],
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
            })
          })
        })
      })
    })
  })
})
