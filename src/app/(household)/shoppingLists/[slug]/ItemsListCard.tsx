"use client";

import React from "react";
import Card from "@/app/_components/Card";
import Button from "@/app/_components/Button";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { 
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
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

  // updateActive Mutation
  const { mutate: updateActiveMutate } = api.shoppingListItem.updateActive.useMutation({
    onSuccess: (response) => {
      console.log("UPDATED ACTIVE ITEM STATUS", response);
      router.refresh();
    },
  });

  // removes the item from the database
  const handleDeleteItem = (id: string) => {
    deleteMutate({ id: id });
  };

  // update the item to active or not active
  // the item will have a strike through if it is not active
  const handleUpdateActive = (id: string) => {
    console.log("MARK ITEM AS COMPLETE: ", id);
    updateActiveMutate({ id: id, active: !shoppingItem.active });
  }

  // TODO: Style component to look like an item in a list
  return (
    <Card>
      {shoppingItem.name}
      <Button
        type="button"
        className="h-8 w-8"
        onClick={() => handleUpdateActive(shoppingItem.id)}
      >
        <CheckCircleIcon />
      </Button>
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
