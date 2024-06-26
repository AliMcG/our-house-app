"use client";

import React, { useState } from "react";
import Card from "@/app/_components/Card";
import Button from "@/app/_components/Button";
import ConfirmDeleteModal from "@/app/_components/modals/ConfirmDeleteModal";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import type { ShoppingList } from "@prisma/client";
import Link from "next/link";

/** As the api mutation in this Component is interacting with a Page (Server Component)
 * we need to use `router.refresh()` to invaliadate the cached data in the Page (Server Component).
 * If the cache data is in a "use client" component then we can use `api.useUtils()` hook instead.
 * further reading here: https://trpc.io/docs/client/react/useUtils
 */

export default function ShoppingListCard({
  shoppingList,
}: {
  shoppingList: ShoppingList;
}) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const router = useRouter();
  const { mutate } = api.shoppingList.delete.useMutation({
    onSuccess: (response) => {
      console.log("DELETED shoping list", response);
      setIsConfirmModalOpen(false)
      router.refresh();
    },
  });
  const deleteList = () => {
    mutate({ id: shoppingList.id });
  };
  const confirmDeleteById = () => {
    setIsConfirmModalOpen(true);
  };
  return (
    <>
      <Card>
        <Link href={`/shoppingLists/${shoppingList.title}`}>
          {shoppingList.title}
        </Link>
        <Button
          type="button"
          className="h-8 w-8"
          onClick={() => confirmDeleteById()}
        >
          <XCircleIcon />
        </Button>
      </Card>
      <ConfirmDeleteModal
        confirmDelete={deleteList}
        isConfirmModalOpen={isConfirmModalOpen}
        setIsConfirmModalOpen={setIsConfirmModalOpen}
      >
        <p>You are about to delete this list: {shoppingList.title}</p>
      </ConfirmDeleteModal>
    </>
  );
}
