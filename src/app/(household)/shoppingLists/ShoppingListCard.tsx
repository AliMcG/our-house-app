"use client";

import React, { useState } from "react";
import Card from "@/app/_components/Card";
import Button from "@/app/_components/Button";
import ConfirmModal from "@/app/_components/modals/ConfirmModal";
import { useRouter } from "next/navigation";
import Select, { type SingleValue } from 'react-select'
import { api } from "@/trpc/react";
import {
  XCircleIcon,
  PencilSquareIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import type { ShoppingList } from "@prisma/client";
import Link from "next/link";
import { sanitiseTitleStringForURL } from "@/app/utils/helperFunctions";
import { Label } from "@headlessui/react";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [newName, setNewName] = useState(shoppingList.title);
  const [householdId, sethouseholdId] = useState("");

  const { data: listOfHouseHolds } = api.householdRouter.list.useQuery();

  const router = useRouter();
  const { mutate } = api.shoppingList.delete.useMutation({
    onSuccess: (response) => {
      console.log("DELETED shoping list", response);
      setIsConfirmModalOpen(false);
      router.refresh();
    },
  });
  const { mutate: editMutate } = api.shoppingList.edit.useMutation({
    onSuccess: (response) => {
      console.log("Edited shoping list", response);
      router.refresh();
    },
  });
  const { mutate: shareMutate } = api.shoppingList.addToHousehold.useMutation({
    onSuccess: (response) => {
      console.log("Added shoping list to household", response);
      router.refresh();
    }
  })
  const deleteList = () => {
    mutate({ id: shoppingList.id });
  };
  const confirmDeleteById = () => {
    setIsConfirmModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };
  const handleSelectChange = (e: SingleValue<{ value: string; label: string; }>) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    sethouseholdId(e?.value as string);
  };
const shareList = () => {
  setIsShareModalOpen(false)
  shareMutate({ id: shoppingList.id, householdId: householdId})
}
  const editList = () => {
    setIsEditModalOpen(false);
    editMutate({ id: shoppingList.id, title: newName });
  };

  const confirmEdit = () => {
    setIsEditModalOpen(true);
  };
  const confirmShare = () => {
    setIsShareModalOpen(true);
  };
  const selectOptions = listOfHouseHolds?.map((household) => {
    return { value: household.id, label: household.name}
  })

  return (
    <>
      <Card data-cy="ShoppingListCard">
        <Link
          href={sanitiseTitleStringForURL(
            `/shoppingLists/${shoppingList.title}`,
          )}
          className="flex w-full justify-center p-4"
        >
          {shoppingList.title}
        </Link>
        <div className="flex w-full justify-end gap-2">
          <Button
            type="button"
            className="h-8 w-8"
            onClick={() => confirmDeleteById()}
            data-cy={`ShoppingListCard-delete-${shoppingList.title}`}
          >
            <XCircleIcon />
          </Button>
          <Button
            type="button"
            className="h-8 w-8"
            onClick={() => confirmEdit()}
            data-cy="ShoppingListCard-edit"
          >
            <PencilSquareIcon />
          </Button>
          <Button
            type="button"
            className="h-8 w-8"
            onClick={() => confirmShare()}
            data-cy="ShoppingListCard-share"
          >
            <ShareIcon />
          </Button>
        </div>
      </Card>
      <ConfirmModal
        confirmFunction={deleteList}
        confirmFunctionText={"Delete"}
        isConfirmModalOpen={isConfirmModalOpen}
        setIsConfirmModalOpen={setIsConfirmModalOpen}
      >
        <p>You are about to delete this list: {shoppingList.title}</p>
      </ConfirmModal>
      <ConfirmModal
        confirmFunction={editList}
        confirmFunctionText={"Edit"}
        isConfirmModalOpen={isEditModalOpen}
        setIsConfirmModalOpen={setIsEditModalOpen}
      >
        <p>Edit name:</p>
        <input
          className="focus:ring-primary-500 focus:border-primary-500 mb-4 block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm"
          type="text"
          value={newName}
          onChange={handleNameChange}
          autoFocus
          data-cy="confirmModal-edit-input"
        />
      </ConfirmModal>
      <ConfirmModal
        confirmFunction={shareList}
        confirmFunctionText={"Share"}
        isConfirmModalOpen={isShareModalOpen}
        setIsConfirmModalOpen={setIsShareModalOpen}
      >
        <label>Select household</label>
        <Select options={selectOptions} onChange={(e) => handleSelectChange(e)}/>
      </ConfirmModal>
    </>
  );
}
