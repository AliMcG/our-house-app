import { CreateHouseholdDialog } from "@/app/_components/modals/create-household-dialog";
import { CreateShoppingListDialog } from "@/app/_components/modals/create-shoppinglist-dialog";
import { InviteMemberDialog } from "@/app/_components/modals/invite-member-dialog";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import Header from "@/app/_components/layout/header";
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

  // TODO : determine current household logic how can we tell which household is current?
  // for now we will just take the first household in the list
  const currentHousehold = householdList[0];

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
      <article className="flex min-h-screen flex-col bg-white pt-16 text-slate-700">
        <header className="space-evenly ml-24 mt-2 flex items-center p-4 pl-6">
          {householdList.map((household, index) => {
            return (
              <div className="mx-1" key={index + household.id}>
                <h1 className="md:text-1xl flex cursor-pointer rounded-2xl border-2 border-solid border-slate-400 text-center font-extrabold  tracking-tight shadow-lg hover:bg-slate-100 lg:text-2xl xl:text-3xl">
                  <p key={index + household.id} className="p-4">
                    {household.name}
                  </p>
                  <Link
                    href={"/profile"}
                    className="rounded-2xl border-2 border-solid border-slate-400 shadow-lg"
                  >
                    <Edit2Icon className="mx-auto h-8 w-8 text-gray-400" />
                  </Link>
                </h1>
              </div>
            );
          })}
        </header>
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {!currentHousehold ? (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No Households
              </h3>
              <p className="mt-2 text-gray-500">
                Create your first household to get started with managing lists and
                tasks.
              </p>
              <div className="mt-6">
                <CreateHouseholdDialog />
              </div>
            </div>
          ) : (
            <div className="ml-24 space-y-6">
              {/* Quick stats */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Shopping Lists
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <Link href={`/shopping-lists`}>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {currentHousehold.shoppingLists.length || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Active lists
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
                      <div className="text-2xl font-bold">
                        chores list count
                        {/* {currentHousehold._count?.tasks || 0} */}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Pending tasks
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
                      <div className="text-2xl font-bold">
                        number of calender events
                        {/* {currentHousehold._count?.calendarEvents || 0} */}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Upcoming events
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
                      <div className="text-2xl font-bold">
                        {currentHousehold.members?.length || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Active members
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              </div>

              {/* Household members */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Household Members</CardTitle>
                      <CardDescription>
                        People who have access to this household
                      </CardDescription>
                    </div>
                    <InviteMemberDialog householdId={currentHousehold.id} />
                  </div>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/members/${currentHousehold.id}`}
                    className="rounded-2xl border-2 border-solid border-slate-400 shadow-lg"
                  >
                    <div className="space-y-4">
                      {currentHousehold.members?.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
                                <Image
                                  src={member.user.image ? member.user.image : ""}
                                  alt="logo"
                                  width={40}
                                  height={40}
                                  className="flex h-auto w-full justify-center"
                                />
                              </div>
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
                    </div>
                  </Link>
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
        </main>
      </article>
    </>
  );
}
