import { CreateHouseholdDialog } from "@/app/_components/modals/create-household-dialog";
import { CreateShoppingListDialog } from "@/app/_components/modals/create-shoppinglist-dialog";
import { InviteMemberDialog } from "@/app/_components/modals/invite-member-dialog";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import Header from "@/app/_components/layout/header";
import { getServerAuthSession } from "@/server/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { api } from "@/trpc/server";
import type { Prisma } from "@prisma/client";
import {
  Calendar,
  CheckSquare,
  Edit2Icon,
  Plus,
  ShoppingCart,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * As the API return for this query also includes related User objects for createdBy and members,
 * we need to define the type explicitly to include these relations.
 * Prisma.HouseholdGetPayload is used to infer the correct type with the included relations.
 */
export type HouseholdWithRelations = Prisma.HouseholdGetPayload<{
  include: {
    createdBy: true;
    members: {
      include: {
        user: true;
      };
    };
    chores: true;
    shoppingLists: true;
    userInvites: {
      include: {
        inviterUser: true;
      };
    };
  };
}>;

export default async function Home() {
  const householdList: HouseholdWithRelations[] =
    await api.householdRouter.list.query();
  const session = await getServerAuthSession();
  if (!session) {
    // This should never happen due to layout protection, but TypeScript requires it
    throw new Error('User session not found');
  }

  // TODO : determine current household logic how can we tell which household is current?
  // for now we will just take the first household in the list
  const currentHousehold = householdList[0];

  // navigate to the profile page
  function goToProfile() {
    window.location.href = "/profile";
  }
  /**
   * // TODO
   * Need to update the relationship between household and main sections in the Prisma schema
   * to ensure that each household has its own set of shopping lists, tasks, calendar events, and members.
   * The current schema does not fully support this structure.
   *
   * - Calendar - not currently supported by the household relations
   *
   * The quick action button on each section to create a new item in that section.
   * Clicking on the section should take the user to that section within the current household.
   * or clicking on the quick action button should open a modal to create a new item in that section.
   * i.e. clicking on the shopping lists section should take the user to the shopping lists page for the current household
   * clicking on the quick action button on the shopping lists section should open a modal to create a new shopping list for the current household.
   */

  return (
    <>
      <Header title="Dashboard">
        <CreateHouseholdDialog />
      </Header>
      <section>
        {/* New User No Households */}
        {!currentHousehold ? (
          <section className="flex flex-col items-center p-2 text-center gap-4">
            <Users className="h-12 w-12 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">
              No Households
            </h2>
            <p className="text-gray-500">
              Create your first household to get started with managing lists and
              tasks.
            </p>
            <CreateHouseholdDialog />
          </section>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            {/* Household selector */}
            <section className="flex flex-col gap-2" aria-labelledby="households-list">
              <h2 id="households-list" className="text-sm font-medium">Households</h2>
              <ul className="flex overflow-y-auto gap-2 w-full pb-4 border-b-2 border-gray-200">
                {householdList.map((household, index) => {
                  if (household.createdBy.id === session.user.id) {
                    // User is the creator of the household, show edit icon
                    return (
                      <li 
                        key={index + household.id}
                        className="relative"
                      >
                        <Button variant="outline" className="pr-9">{household.name}</Button>
                        <Link
                          href={"/profile"}
                          className="absolute top-0 right-0 block h-full px-2"
                        >
                          <span className="flex h-full w-full items-center">
                            <Edit2Icon className="mx-auto h-4 w-4 text-muted-foreground" />
                          </span>
                        </Link>
                      </li>
                    );
                  } else {
                    return (
                      <li 
                        key={index + household.id}
                        className="relative"
                      >
                        <Button variant="outline">{household.name}</Button>
                      </li>
                    );
                  }
                })}
              </ul>
            </section>
            {/* Quick stats */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-labelledby="quick-stats">
              {/* this header is for accessibility only */}
              <h2 id="quick-stats" className="sr-only">Quick Stats</h2>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Shopping Lists
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <Link href={`/shopping-lists`}>
                  <CardContent>
                    <p className="flex flex-col items-start">
                      <span className="text-2xl font-bold">
                        {currentHousehold.shoppingLists.length || 0}
                      </span>
                      <span className="text-xs text-muted-foreground">Active lists</span>
                    </p>
                  </CardContent>
                </Link>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasks</CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <Link href={`/chores`}>
                  <CardContent>
                    <p className="flex flex-col items-start">
                      <span className="text-2xl font-bold">
                        0
                        {/* {currentHousehold._count?.tasks || 0} */}
                      </span>
                      <span className="text-xs text-muted-foreground">Pending tasks</span>
                    </p>
                  </CardContent>
                </Link>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <Link href={`/calender`}>
                  <CardContent>
                    <p className="flex flex-col items-start">
                      <span className="text-2xl font-bold">
                        0
                        {/* {currentHousehold._count?.calendarEvents || 0} */}
                      </span>
                      <span className="text-xs text-muted-foreground">Upcoming events</span>
                    </p>
                  </CardContent>
                </Link>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <Link href={`/profile`}>
                  <CardContent>
                    <p className="flex flex-col items-start">
                      <span className="text-2xl font-bold">
                        {currentHousehold.members?.length || 0}
                      </span>
                      <span className="text-xs text-muted-foreground">Active members</span>
                    </p>
                  </CardContent>
                </Link>
              </Card>
            </section>

            {/* Household members */}
            <Card>
              <CardHeader className="sm:flex-row sm:justify-between gap-2">
                <div className="sm:w-3/6">
                  <CardTitle>Household Members</CardTitle>
                  <CardDescription>
                    People who have access to this household
                  </CardDescription>
                </div>
                <div className="flex flex-wrap justify-start gap-2 sm:justify-end sm:w-3/6">
                  <InviteMemberDialog householdId={currentHousehold.id} />
                  <Link href={`/members/${currentHousehold.id}`}>
                    <Button>
                      Edit Member
                      <span className="flex h-full w-full pl-2 items-center">
                        <Edit2Icon className="h-4 w-4 text-slate-100" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {currentHousehold.members?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 overflow-hidden rounded-full border-4 border-blue-100">
                        <Image
                          src={member.user.image ? member.user.image : ""}
                          alt="logo"
                          width={40}
                          height={40}
                          className="flex h-auto w-full justify-center"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {member.user?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {member.user?.email}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        member.userId === currentHousehold.createdById
                          ? "default"
                          : "secondary"
                      }
                    >
                      {member.userId === currentHousehold.createdById
                        ? "Owner"
                        : "member"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks to manage your household
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <CreateShoppingListDialog householdId={currentHousehold.id} />
                  <Button variant="outline" className="justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </>
  );
}
