import { InviteStatus, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Resend } from "resend";
import crypto from "crypto";
import { getBaseUrl } from "@/trpc/shared";
import { emailHtmlTemplate } from "./inviteEmailHtmlTemplate";

export const findHouseholdUserUniqueId = async (
  householdId: string,
  userId: string,
  prismaCtx: PrismaClient,
) => {
  const householdUser = await prismaCtx.householdUser.findFirst({
    where: {
      householdId: householdId,
      userId: userId,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
  return householdUser;
};

export const createHouseholdInvite = async (
  householdId: string,
  senderUserId: string,
  invitedEmail: string,
  invitedName: string,
  prismaCtx: PrismaClient,
) => {
  const householdInvite = await prismaCtx.householdInvite.create({
    data: {
      householdId,
      senderUserId,
      invitedEmail,
      invitedName,
    },
  });
  return householdInvite;
};

export const findUserByEmail = async (
  userEmail: string,
  prismaCtx: PrismaClient,
) => {
  const user = await prismaCtx.user.findUnique({
    where: {
      email: userEmail,
    },
  });
  return user;
};

export const sendEmailInvite = async (
  invitedEmail: string,
  senderName: string,
  householdInviteId: string,
  isNewUser: boolean,
  prismaCtx: PrismaClient,
) => {
  const now = new Date();

  /**
   * random token generation.
   * This might be sufficient or we could look at JWT?
   */
  const token = crypto.randomBytes(32).toString("hex");

  const resend = new Resend(process.env.RESEND_API_KEY);

  const emailInviteLink = `${getBaseUrl()}/invite/${token}`;

  const sent = await resend.emails.send({
    from: `onboarding@ourhousetheapp.com`,
    to: invitedEmail,
    subject: "Invite to join OurHouse app",
    html: emailHtmlTemplate(senderName, emailInviteLink, isNewUser),
  });

  if (!sent.data) {
    /**
     * Update the db to store the failed sending of email.
     */
    await prismaCtx.householdInvite.update({
      where: {
        id: householdInviteId,
      },
      data: {
        status: InviteStatus.SENDING_ERROR,
      },
    });
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to send email invite to: ${invitedEmail}`,
      cause: sent.error,
    });
  }
  /**
   * Update the invite db table with details
   */
  try {
    await prismaCtx.householdInvite.update({
      where: {
        id: householdInviteId,
      },
      data: {
        token,
        expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 3000), // set to 3 days from now()
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to update invite details for id: ${householdInviteId}`,
      cause: error,
    });
  }

  return sent.data ? true : false;
};
