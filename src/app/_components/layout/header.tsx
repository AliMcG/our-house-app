'use client'

// import { useSession } from "next-auth/react";
// import { CreateHouseholdDialog } from "../modals/create-household-dialog";
// import { InviteMemberDialog } from "../modals/invite-member-dialog";
import { usePathname } from "next/navigation";
import { navigation } from "@/app/utils/navbarLinks";
import { getRouteName } from "@/app/utils/helperFunctions";
// import { api } from "@/trpc/react";

/**
 * // TODO this component is a Work In Progress
 * The header should show the name of the page and also hold a quick create button
 * depending on the page you are on.
 * on the dashboard it should be to create a new household
 * on the shopping-lists page it should be to create a new shopping list
 * on the tasks page it should be to create a new task
 * 
 * But not clear how to implement this yet.
 */
export default function Header(): JSX.Element {
    // const householdList = api.householdRouter.list.useQuery();
    const pathname = usePathname()
    const currentRouteName = getRouteName(pathname, navigation);
    // const session = useSession();
    // const userId = session.data?.user?.id

    return (

        <header className="fixed flex bg-slate-50 border-b border-slate-200 px-6 h-20 py-4 w-screen">
            <div className="flex items-center justify-between">
                <div className="md:ml-24">
                    <h1 className="text-2xl font-bold text-slate-700">
                        {currentRouteName ? `${currentRouteName}` : 'Dashboard'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage your household, lists, and tasks
                    </p>
                </div>
                {/* Work out the logic to show the correct create button */}
                {/* <div className="flex items-center space-x-4">
                    {currentHousehold && (
                        <InviteMemberDialog
                            householdId={currentHousehold.id}
                        />
                    )}
                    <CreateHouseholdDialog
                        householdId={currentHousehold.id}                   />
                </div> */}
            </div>
        </header>

    );
}