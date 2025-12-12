import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { acceptInviteAction } from "./actions";
import SuccessRedirect from "./SuccessComponent";

/**
 * Finalizes the invitation process of adding a user to another household
 */
export default async function CompleteInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ inviteToken?: string }>;
}) {
  const {inviteToken} = await searchParams;
  const session = await getServerAuthSession();
  const token = inviteToken;

  // user must be signed before anything else
  if (!session) {
    // redirect to Google signin and back here
    redirect(`/invite/error?code=session_required`);
  }

  // we must have a token in the url
  if (!token) {
    redirect("/invite/error?code=missing_token");
  }

  // user must have an email
  if (!session.user.email) {
    redirect("/invite/error?code=missing_email");
  }

  // server action
  const result = await acceptInviteAction(
    token,
    session.user.id,
    session.user.email,
  );

  if (result.success) {
    return (
      <div>
        <SuccessRedirect householdName={result.householdName} />
      </div>
    );
  } else {
    return (
      <div>
        <h2>Error</h2>
        <p>{result.message}</p>
      </div>
    );
  }
}
