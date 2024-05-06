"use client";

import React from "react";
import Card from "@/app/_components/Card";
import Button from "@/app/_components/Button";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import type { ShoppingList } from "@prisma/client";
import Link from "next/link";

export default function ShoppingListCard({
  shoppingList,
}: {
  shoppingList: ShoppingList;
}) {
    /** As the api mutation in this Component is interacting with a Page (Server Component)
   * we need to use `router.refresh()` to invaliadate the cached data in the Page (Server Component).
   * If the cache data is in a "use client" component then we can use `api.useUtils()` hook instead.
   * further reading here: https://trpc.io/docs/client/react/useUtils
   */
  const router = useRouter();
  const { mutate } = api.shoppingList.delete.useMutation({
    onSuccess: (response) => {
      console.log("DELETED shoping list", response);
      router.refresh();
    },
  });
  const deleteList = (id: string) => {
    mutate({ id: id });
  };
  return (
    <Card>
      <Link href={`/shoppingLists/${shoppingList.title}`}>
        {shoppingList.title}
      </Link>
      <Button
        type="button"
        className="h-8 w-8"
        onClick={() => deleteList(shoppingList.id)}
        >
        <XCircleIcon />
      </Button>
    </Card>
  );
}
