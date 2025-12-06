import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { acceptInviteAction } from "./actions";


/**
 * Finalizes the invitation process of adding a user to another household
 * @param param0 
 * @returns 
 */
export default async function CompleteInvitePage({ searchParams }: { searchParams: { inviteToken?: string } }) {
  const session = await getServerAuthSession();
  const token = searchParams.inviteToken;

  
  // user must be signed before anything else
    if (!session) {
      // redirect to Google signin and back here
      redirect(`/invite/error?code=session_required`)
    }
    
    // we must have a token in the url
    if (!token) {
      redirect('/invite/error?code=missing_token');
    }

  // user must have an email
  if (!session.user.email) {
    redirect('/invite/error?code=missing_email');
  }

  // server action
  const result = await acceptInviteAction(token, session.user.id, session.user.email);

  if (result.success) {
    return (
      <div>
        <h2>Success!</h2>
        <p>You successfully joined Household {result.household}</p>
      </div>
    )
  }else {
    return (
      <div>
        <h2>Error</h2>
        <p>{result.message}</p>
      </div>
    )
  }
}
