import Card from "@/app/_components/Card";
import { InviteMemberDialog } from "@/app/_components/modals/invite-member-dialog";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/_components/ui/card";
import { api } from "@/trpc/server";
import Image from "next/image";
import { Badge } from "@/app/_components/ui/badge";
import { DeleteMemberDialog } from "@/app/_components/modals/delete-member-dialog";

/** By default pages are server components in next.js 14
 * This means we can use "@/trpc/server" to query our database.
 * Which should result in faster load times for the data.
 */
export default async function Members({
  params,
}: {
  params: Promise<{ householdId: string }>;
}) {
  const { householdId } = await params;
  console.log("Members page - householdId:", householdId);
  const currentHousehold = await api.householdRouter.findById.query({
    id: householdId,
  });

  return (
    <article className="flex min-h-screen flex-col bg-white pt-24 text-slate-800">
      <div className="mt-5 flex justify-center">
        <div className="flex gap-4">
          {/* Household members */}
          {currentHousehold && (
            <Card className="flex w-full flex-1">
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
                <div className="space-y-4">
                  {currentHousehold.members?.map((member) => (
                    <div
                      key={member.user.id}
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
                      <DeleteMemberDialog
                        householdId={currentHousehold.id}
                        userToDeleteId={member.user.id}
                        userToDeleteName={member.user.name}
                      />
                      <Badge
                        variant={
                          member.user.id === currentHousehold.createdById
                            ? "default"
                            : "secondary"
                        }
                      >
                        {member.user.id === currentHousehold.createdById
                          ? "Owner"
                          : "member"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </article>
  );
}
