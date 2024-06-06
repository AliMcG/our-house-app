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
  
  // TODO: Style component to look like an item in a list
  return (
    <Card>
      {shoppingItem.name}
      <Button
        type="button"
        className="h-8 w-8"
        onClick={() => updateActive(shoppingItem.id, shoppingItem.active)}
      >
        <CheckCircleIcon />
      </Button>
      <Button
        type="button"
        className="h-8 w-8"
        onClick={() => deleteItem(shoppingItem.id)}
      >
        <XCircleIcon />
      </Button>
    </Card>
  );
}
