'use server';

import { api } from "@/trpc/server";


type JoinResult = { success: true, householdName: string } | { success: false, message: string }

export async function acceptInviteAction(token: string, userId: string, userEmail: string): Promise<JoinResult> {
  try {
    // validate invite token via tRPC
    const invite = await api.householdUserRouter.findInviteByToken.query(
      { inviteToken: token }
    );

    if (!invite) {
      return {
        success: false,
        message: 'Invite is invalid or expired'
      };
    }

    // at this point we can now add user to household
    const userToHousehold = {
      accepted: true,
      userId: userId,
      inviteToken: token
      
    }
    await api.householdUserRouter.processUserHouseholdInvite.mutate(userToHousehold);

    return {
      success: true,
      householdName: invite.household.name
    }

  }catch(e) {
    return {
      success: false,
      message: 'An unexpected error occurred during the joining process.'
    };
  }
}
