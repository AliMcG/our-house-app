// app/api/auth/google-invite-callback/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";

/**
 * This code was suggested by ChatGPT to handle the Google OAuth callback for invite acceptance.
 * But it does not appear to be directly usable as Next.js API route or actually work.
 * This should be considered highly unstable and may need significant adjustments.
 * 
 * The main idea is:    
 * 1. Extract the invite token from the query parameters.
 * 2. Verify the token and retrieve the corresponding invite details from the database.
 * 3. Get the current session to identify the logged-in user.   
 * 4. Check if the logged-in user's email matches the invited email.
 * 5. If it matches, add the user to the household and update the invite status.
 * 6. Redirect the user to the appropriate page (household dashboard or error page).
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    console.log("SEARCH PARAMS:", searchParams);
    const inviteToken = searchParams.get("token");
    console.log("Google invite callback invoked with token:", inviteToken);

    if (!inviteToken) {
        return NextResponse.redirect(new URL("/invite-error?message=Missing invite token.", req.url));
    }

    try {
        // 1. Find the invite
        const invite = await db.householdInvite.findUnique({
            where: { token: inviteToken },
            include: { household: true },
        });

        if (!invite) {
            return NextResponse.redirect(new URL("/invite-error?message=Invalid or expired invite.", req.url));
        }
        if (invite.status !== 'PENDING' || (invite.expiresAt && invite.expiresAt < new Date())) {
            return NextResponse.redirect(new URL("/invite-error?message=Invite has expired or is no longer valid.", req.url));
        }

        // 2. Get the current session (user must be logged in after Google auth)
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || !session.user.email) {
            // This should not happen if Google auth was successful.
            // It implies the session isn't set up correctly or the callback URL was misused.
            return NextResponse.redirect(new URL("/invite-error?message=Could not retrieve user session after sign-in.", req.url));
        }

        // 3. Verify the logged-in user's email matches the invited email.
        if (session.user.email !== invite.invitedEmail) {
            // User logged in with Google, but their email doesn't match the invite.
            // Redirect them to a page where they can sign out and sign in with the correct account.
            // This could be a dedicated page or handled by the invite page itself.
            // For now, let's redirect to the invite page with mismatch context.
            return NextResponse.redirect(new URL(`/invite/${inviteToken}?mismatch=true`, req.url));
        }

        // 4. User logged in, email matches. Add to household and update invite.
        try {
            await db.householdUser.create({
                data: {
                    userId: session.user.id,
                    householdId: invite.householdId,
                },
            });

            await db.householdInvite.update({
                where: { id: invite.id },
                data: {
                    status: 'ACCEPTED',
                    acceptedAt: new Date(),
                    invitedUserId: session.user.id,
                },
            });

            // Redirect to the household page or dashboard
            return NextResponse.redirect(new URL(invite.householdId ? `/household/${invite.householdId}` : '/dashboard', req.url));

        } catch (e: any) {
            if (e.code === "P2002") { // Prisma error for unique constraint violation
                // User is already in the household. Mark invite as accepted.
                await db.householdInvite.update({
                    where: { id: invite.id },
                    data: {
                        status: 'ACCEPTED',
                        acceptedAt: new Date(),
                        invitedUserId: session.user.id,
                    },
                });
                // Still redirect to their household
                return NextResponse.redirect(new URL(invite.householdId ? `/household/${invite.householdId}` : '/dashboard', req.url));
            }
            console.error("Error adding user to household post-Google auth:", e);
            return NextResponse.redirect(new URL("/invite-error?message=An error occurred while processing your invite.", req.url));
        }
    } catch (error) {
        console.error("Error in Google invite callback:", error);
        return NextResponse.redirect(new URL("/invite-error?message=An unexpected error occurred.", req.url));
    }
}