"use client";

import React from "react";
import Card from "@/app/_components/Card";
import Button from "@/app/_components/Button";
import { 
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import type { ChoresItem } from "@prisma/client";


export default function ItemsListCard({
  choresItem,
  deleteItem,
  updateActive
}: {
  choresItem: ChoresItem;
  deleteItem: (id: string) => void;
  updateActive: (id: string, active: boolean) => void;
}) {
  const { id, name, active, completedBy } = choresItem;

  // styles the item when is marked as completed
  const cardStyles = !active ? "bg-red" : "bg-white";
  const textStyles = !active ? "line-through" : "none";
  // for now the active button is not styled, defaulting to theme colour
  const buttonStyles = !active ? "bg-gray-400" : "";

  return (
    <Card 
      className={`grid grid-cols-[32px_1fr_32px] gap-2 w-full px-2 py-4 ${cardStyles}`}
      data-cy="ChoresItemCard"
    >
      <Button
        type="button"
        className={`h-8 w-8 ${buttonStyles}`}
        onClick={() => updateActive(id, active)}
        data-cy="ChoresItemCard-btn-active"
        >
        <CheckCircleIcon />
      </Button>
      <div>
        <p className={textStyles} onClick={() => updateActive(id, active)}>{name}</p>
        {completedBy && <p className="text-xs">Completed by: {completedBy}</p>}
      </div>
      <Button
        type="button"
        className="h-8 w-8"
        onClick={() => deleteItem(id)}
        data-cy="ChoresItemCard-btn-delete"
      >
        <XCircleIcon />
      </Button>
    </Card>
  );
}
