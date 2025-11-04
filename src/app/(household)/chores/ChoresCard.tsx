"use client";

import React, { useState } from "react";
import Card from "@/app/_components/Card";
import Button from "@/app/_components/Button";
import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/solid";
import type { Chores } from "@prisma/client";
import Link from "next/link";
import ConfirmModal from "@/app/_components/modals/ConfirmModal";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { sanitiseStringForURL } from "@/app/utils/helperFunctions";

export default function ChoresCard({ choresList }: { choresList: Chores }) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newName, setNewName] = useState(choresList.title);

  const router = useRouter();
  const { mutate } = api.chores.delete.useMutation({
    onSuccess: () => {
      setIsConfirmModalOpen(false);
      router.refresh();
    },
  });
  const { mutate: editMutate } = api.chores.edit.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  // uses a modal to confirm Selection before heading to the server
  const deleteList = () => {
    mutate({ id: choresList.id });
  };
  const confirmDeleteById = () => {
    setIsConfirmModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const editList = () => {
    setIsEditModalOpen(false);
    editMutate({ id: choresList.id, title: newName });
  };

  const confirmEdit = () => {
    setIsEditModalOpen(true);
  };

  return (
    <>
      <Card data-cy="ChoresCard">
        <Link
          href={sanitiseStringForURL(`/chores/${choresList.id}`)}
          className="flex w-full justify-center p-4"
        >
          {choresList.title}
        </Link>
        <div className="flex w-full justify-end gap-2">
          <Button
            type="button"
            className="h-8 w-8"
            onClick={() => confirmDeleteById()}
            data-cy="ChoresCard-deleteButton"
          >
            <XCircleIcon />
          </Button>
          <Button
            type="button"
            className="h-8 w-8"
            onClick={() => confirmEdit()}
            data-cy="ChoresCard-editButton"
          >
            <PencilSquareIcon />
          </Button>
        </div>
      </Card>
      <ConfirmModal
        confirmFunction={deleteList}
        isConfirmModalOpen={isConfirmModalOpen}
        setIsConfirmModalOpen={setIsConfirmModalOpen}
        confirmFunctionText={"Delete"}
      >
        <p>You are about to delete the chores: {choresList.title}</p>
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
    </>
  );
}
