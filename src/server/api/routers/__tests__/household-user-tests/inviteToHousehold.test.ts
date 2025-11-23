import { describe, expect } from "@jest/globals";
import { Prisma } from "@prisma/client";
import { createMockTRPCContext } from "../../../../../../jest.setup";
import { fakeHouseholdComplete, fakeHouseholdInviteComplete } from "../../../../../../types/fake-data";
import { Context, createMockContext, MockContext } from '../../../../context';
import { householdUserRouter } from "../../householdUser/householdUserRouter";

export type HouseholdInvite = Prisma.HouseholdInviteGetPayload<{
  select: {
    householdId: true,
    invitedEmail: true,
    invitedName: true,
  }
}> & {
  senderName: string
}

jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn()
        .mockResolvedValue(
          {
            data: { id: 'Testing-id' },
            error: null,
            headers: {
              "header-1": "some header"
            }
          }
        )
    }
  }))
}))

describe('Feature: Invite To Household', () => {
  let mockCtx: MockContext
  let ctx: Context


  beforeAll(async () => {
    mockCtx = createMockContext()
    ctx = mockCtx
  })

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Scenario: Successfully send email invite to a new user to a household", () => {
    describe('Given the sender is authenticated', () => {
      describe("And is the owner of the household", () => {
        describe('When the sender sends a add user to household request', () => {
          describe("And the required parameters have been sent", () => {
            describe("When the new user is not already registered with the app", () => {
              test("Then a new invite email should be sent ", async () => {

                const email = 'ali.mcgill1@gmail.com'
                const invitedName = 'Ali'
                const senderName = 'Carlos'
                // const email = 'webshuriken@gmail.com'
                const mockHouseholdInvite = fakeHouseholdInviteComplete()
                const mockHousehold = fakeHouseholdComplete()

                const mockContext = createMockTRPCContext<HouseholdInvite>(mockCtx.prisma, { householdId: mockHouseholdInvite.householdId, invitedEmail: email, invitedName: invitedName, senderName: senderName })

                const householdSpy = jest.spyOn(ctx.prisma.household, 'findFirst').mockResolvedValueOnce(mockHousehold)
                const userSpy = jest.spyOn(ctx.prisma.user, 'findUnique')
                const householdInviteSpy = jest.spyOn(ctx.prisma.householdInvite, 'create').mockResolvedValueOnce(mockHouseholdInvite)


                const emailSent = await householdUserRouter.inviteToHousehold(mockContext);

                expect(emailSent).toBeTruthy()
                expect(userSpy).toHaveBeenCalled()
                expect(householdInviteSpy).toHaveBeenCalled()
                expect(householdSpy).toHaveBeenCalled()


                // Verify DB calls
                // expect(householdInviteSpy).toHaveBeenCalledWith(expect.objectContaining({
                //   data: {
                //     householdId: mockHouseholdInvite.householdId,
                //     senderUserId: expect.any(String),
                //     invitedEmail: email,
                //     invitedName: invitedName,
                //     token: expect.any(String),
                //     expiresAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/),
                //   },
                // }));
              });
            })
          })
        })
      })
    })
  })
})
