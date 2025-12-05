import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import AuthButton from './InviteAuthButton';

/**
 * Unauthenticated route to handle household invite acceptance
 * used 'params' to get token as it is part of the dynamic route
 */
export default async function InvitePage({ params }: { params: { token: string } }) {
  const token = params.token;

  // safety check for missing token
  if (!token) throw {code: "missing_token"}

  // validate token via tRPC
  let invite;
  try {
    invite = await api.householdUserRouter.findInviteByToken.query({ 
      inviteToken: token 
    });
    
    if (!invite) throw {code: "invalid_invite"};

  }catch(e) {
    redirect(`/invite/error?code={e.code}`)
  }

  // user must signin to their Google account to accept invite
  // passing in the url redirect after Google OAuth
  return (
    <div>
      <p>You have been invited to join the household <strong>{invite.household.name}</strong> by {invite.inviterUser.name}.</p>
      <p>The invite is for: <strong>{invite.invitedEmail}</strong>.</p>
      <p>Please sign in with Google to accept the invite.</p>
      <AuthButton size="small" completeInviteUrl={`/invite/complete?inviteToken=${token}`} />
    </div>
  );
}
