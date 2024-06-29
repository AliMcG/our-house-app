"use client";

import React, { useState } from "react";
import Card from "@/app/_components/Card";
import Button from "@/app/_components/Button";
import { XCircleIcon } from "@heroicons/react/24/solid";
import type { Chores } from "@prisma/client";
import Link from "next/link";
import ConfirmModal from "@/app/_components/modals/ConfirmModal";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { sanitiseTitleStringForURL } from "@/app/utils/helperFunctions";


export default function ChoresCard({
  choresList,
}: {
  choresList: Chores;
}) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const router = useRouter();
  const { mutate } = api.chores.delete.useMutation({
    onSuccess: (response) => {
      console.log("DELETED chores list", response);
      setIsConfirmModalOpen(false)
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

  return (
    <>
      <Card>
        <Link href={sanitiseTitleStringForURL(`/chores/${choresList.title}`)}>
          {choresList.title}
        </Link>
        <Button
          type="button"
          className="h-8 w-8"
          onClick={() => confirmDeleteById()}
        >
          <XCircleIcon />
        </Button>
      </Card>
      <ConfirmModal
        confirmFunction={deleteList}
        isConfirmModalOpen={isConfirmModalOpen}
        setIsConfirmModalOpen={setIsConfirmModalOpen} confirmFunctionText={"Delete"}      >
        <p>You are about to delete the chores: {choresList.title}</p>
      </ConfirmModal>
    </>
  );
}
