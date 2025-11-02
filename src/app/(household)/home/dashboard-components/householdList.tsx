'use client';

import { CreateHouseholdDialog } from "@/app/_components/modals/create-household-dialog";
import type { HouseholdWithRelations } from "../page";
import Link from "next/link";
import { Edit2Icon } from "lucide-react";

export const HouseholdList = ({ householdList }: { householdList: HouseholdWithRelations }) => {
    return <header className="flex ml-24 pl-6 p-4 mt-2 space-evenly items-center">
        {householdList.map((household, index) => {
            return (
                <div className="mx-1" key={index + household.id}>
                    <h1 className="flex hover:bg-slate-100 cursor-pointer text-center xl:text-3xl font-extrabold tracking-tight md:text-1xl lg:text-2xl  rounded-2xl border-2 border-solid border-slate-400 shadow-lg">
                        <p key={index + household.id} className="p-4">
                            {household.name}
                        </p>
                        <Link href={'/profile'} className="rounded-2xl border-2 border-solid border-slate-400 shadow-lg">
                            <Edit2Icon className="mx-auto h-8 w-8 text-gray-400" />
                        </Link>
                    </h1>
                </div>

            );
        })}
        <div className="ml-6">
            <CreateHouseholdDialog
            />
        </div>
    </header>
}   