"use client";

import React from "react";
import Card from "@/app/_components/Card";
import Button from "@/app/_components/Button";
import { 
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import type { ShoppingItem } from "@prisma/client";


export default function ItemsListCard({
  shoppingItem,
  deleteItem,
  updateActive
}: {
  shoppingItem: ShoppingItem;
  deleteItem: (id: string) => void;
  updateActive: (id: string, active: boolean) => void;
}) {
  const { id, name, active } = shoppingItem;

  // styles the item when is marked as completed
  const cardStyles = !active ? "bg-red" : "bg-white";
  const textStyles = !active ? "line-through" : "none";

  return (
    <Card className={`grid grid-cols-[32px_1fr_32px] gap-2 w-full px-2 py-4 ${cardStyles}`}>
      <Button
        type="button"
        className="h-8 w-8"
        onClick={() => updateActive(id, active)}
        >
        <CheckCircleIcon />
      </Button>
        <p className={textStyles}>{name}</p>
      <Button
        type="button"
        className="h-8 w-8"
        onClick={() => deleteItem(id)}
      >
        <XCircleIcon />
      </Button>
    </Card>
  );
}
