import { describe, expect } from "@jest/globals";
import { createMockTRPCContext } from "../../../../../../jest.setup";
import { fakeHouseholdComplete } from "../../../../../../types/fake-data";
import { Context, createMockContext, MockContext } from "../../../../context";
import { householdRouter } from "../../household/householdRouter";
import { Prisma } from "@prisma/client";

export type HouseholdId = Prisma.HouseholdGetPayload<{
  select: {
    id: true;
  };
}>;

describe("Feature: Household API Find By Id", () => {
  let mockCtx: MockContext;
  let ctx: Context;

  beforeAll(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Scenario: Successfully retrieve a specific household by its Id", () => {
    describe("Given the user is authenticated", () => {
      describe("And a household with a known Id exists", () => {
        describe("When the 'findById' query is executed with the household's Id", () => {
          test("Then the response should contain the details of the specified household", async () => {
            const mockHousehold = fakeHouseholdComplete();

            const mockContext = createMockTRPCContext<HouseholdId>(
              mockCtx.prisma,
              { id: mockHousehold.id },
            );

            const findManyHousehold = jest
              .spyOn(ctx.prisma.household, "findUnique")
              .mockResolvedValueOnce(mockHousehold);

            const householdFound = await householdRouter.findById(mockContext);

            expect(householdFound).toStrictEqual(
              expect.objectContaining(mockHousehold),
            );

            expect(findManyHousehold).toHaveBeenCalledWith({
              where: { id: mockHousehold.id },
              include: {
                createdBy: true,
                members: {
                  select: {
                    user: true,
                  },
                },
              },
            });
          });
        });
      });
    });
  });
  describe("Scenario: Attempt to retrieve a non-existent household", () => {
    describe("Given the user is authenticated", () => {
      describe("And a household with a non-existent Id is provided", () => {
        describe("When the 'findById' query is executed with the non-existent Id", () => {
          test("Then the response should indicate that the household was not found", async () => {
            const mockHousehold = fakeHouseholdComplete();

            const mockContext = createMockTRPCContext<HouseholdId>(
              mockCtx.prisma,
              { id: mockHousehold.id },
            );

            const findManyHousehold = jest
              .spyOn(ctx.prisma.household, "findUnique")
              .mockResolvedValueOnce(null);

            const householdFound = await householdRouter.findById(mockContext);

            expect(householdFound).toStrictEqual(null);

            expect(findManyHousehold).toHaveBeenCalledWith({
              where: { id: mockHousehold.id },
              include: {
                createdBy: true,
                members: {
                  select: {
                    user: true,
                  },
                },
              },
            });
          });
        });
      });
    });
  });
});
