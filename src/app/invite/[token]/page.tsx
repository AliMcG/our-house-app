import { api } from "@/trpc/server";
import AuthButton from './InviteAuthButton';

/**
 * Unauthenticated route to handle household invite acceptance
 */
export default async function InvitePage({ params }: { params: { token: string } }) {

    const householdInvite = await api.householdUserRouter.findInviteByToken.query(
        { inviteToken: params.token }
    );

    if (!householdInvite) {
        return <div>Error: Invite details not available.</div>;
    }

    const { household, inviterUser, invitedEmail, invitedUserId  } = householdInvite;

    // if user is already registered then on clicking the "accept" button
    // update db table householdUser and redirect to household page
    // else redirect to google oauth flow with callback to api/auth/google-invite-callback
    if (invitedUserId) {
        return (
            <div>   
                <p>You've been invited to join the household <strong>{household.name}</strong> by {inviterUser.name}.</p>
                <p>The invite is for: <strong>{invitedEmail}</strong>.</p>
                <p>Please sign in to accept the invite.</p>
                <AuthButton size="small" token={params.token} />
            </div>
        );
    }

    return (
        <div>
            <p>You've been invited to join the household <strong>{household.name}</strong> by {inviterUser.name}.</p>
            <p>The invite is for: <strong>{invitedEmail}</strong>.</p>
            <p>Please sign in with Google to accept the invite.</p>
            <AuthButton size="small" token={params.token} />
        </div>
    );
}
