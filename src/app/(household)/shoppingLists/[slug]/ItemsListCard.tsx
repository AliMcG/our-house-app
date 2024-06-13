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

  return (
    <Card>
      <Button
        type="button"
        className="h-8 w-8"
        onClick={() => updateActive(id, active)}
        >
        <CheckCircleIcon />
      </Button>
        <p>{name}</p>
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
