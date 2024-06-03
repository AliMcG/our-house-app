"use client";

import React from "react";
import Card from "@/app/_components/Card";
import Button from "@/app/_components/Button";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import type { ShoppingItem } from "@prisma/client";


export default function ItemsList({
  shoppingItem,
}: {
  shoppingItem: ShoppingItem;
}) {
  const router = useRouter();
  const { mutate: deleteMutate } = api.shoppingListItem.delete.useMutation({
    onSuccess: (response) => {
      console.log("DELETED list item", response);
      router.refresh();
    },
  });

  // removes the item from the database
  const handleDeleteItem = (id: string) => {
    deleteMutate({ id: id });
  };

  // TODO: Style component to look like an item in a list
  return (
    <Card>
      {shoppingItem.name}
      <Button
        type="button"
        className="h-8 w-8"
        onClick={() => handleDeleteItem(shoppingItem.id)}
      >
        <XCircleIcon />
      </Button>
    </Card>
  );
}
