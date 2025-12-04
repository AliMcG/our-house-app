import { api } from "@/trpc/server";
import AuthButton from './InviteAuthButton';

/**
 * Unauthenticated route to handle household invite acceptance
 */
export default async function InvitePage({ params }: { params: { token: string } }) {
  // For this stage we don't need to know if user is registered.
  // We only need to make sure the invite token is valid
  const householdInvite = await api.householdUserRouter.findInviteByToken.query(
      { inviteToken: params.token }
  );

  return (
    <div>
      {
        !householdInvite ? (
          <div>Error: Invite details not available.</div>
        ) : (
          <div>
            <p>You've been invited to join the household <strong>{householdInvite.household.name}</strong> by {householdInvite.inviterUser.name}.</p>
            <p>The invite is for: <strong>{householdInvite.invitedEmail}</strong>.</p>
            <p>Please sign in with Google to accept the invite.</p>
            <AuthButton size="small" token={params.token} />
          </div>
        )
      }
    </div>
  );
}
