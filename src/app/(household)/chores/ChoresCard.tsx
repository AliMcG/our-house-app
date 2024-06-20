"use client";

import React from "react";
import Card from "@/app/_components/Card";
import Button from "@/app/_components/Button";
import { XCircleIcon } from "@heroicons/react/24/solid";
import type { Chores } from "@prisma/client";
import Link from "next/link";

/** As the api mutation in this Component is interacting with a Page (Server Component)
 * we need to use `router.refresh()` to invaliadate the cached data in the Page (Server Component).
 * If the cache data is in a "use client" component then we can use `api.useUtils()` hook instead.
 * further reading here: https://trpc.io/docs/client/react/useUtils
 */

export default function ChoresCard({
  choresList,
}: {
  choresList: Chores;
}) {

  return (
    <>
      <Card>
        <Link href={`/chores/${choresList.title}`}>
          {choresList.title}
        </Link>
        <Button
          type="button"
          className="h-8 w-8"
        >
          <XCircleIcon />
        </Button>
      </Card>
    </>
  );
}
