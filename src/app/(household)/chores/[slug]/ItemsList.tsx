"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import ItemsListCard from "./ItemsListCard";
import ConfirmModal from "@/app/_components/modals/ConfirmModal";
import { useSession } from "next-auth/react";
import type { ChoresItem } from "@prisma/client";


export default function ItemsList({ list }: { list: ChoresItem[] }) {
  const router = useRouter();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string>("");
  const { data: session } = useSession();

  // mutate the item to be deleted
  const { mutate: deleteMutate } = api.choresItem.delete.useMutation({
    onSuccess: () => {
      // lets make sure the modal is close and item to delete is removed from state
      setIsConfirmModalOpen(false);
      setItemToDelete("");
      router.refresh();
    },
  });

  // mutate the item to be active or not active
  const { mutate: updateActiveMutate } = api.choresItem.updateActive.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  // open and close the confirm modal. Used by ItemsListCard component.
  // wrapper function to open the modal and set the item to delete
  const openConfirmModal = (id: string) => {
    setIsConfirmModalOpen(true);
    setItemToDelete(id);
  }

  // callback function to handle the user action, passed to modal as prop
  const handleDeleteItem = () => { deleteMutate({ id: itemToDelete }); };

  // update the item to active or not active
  // the item will have a strike through if it is not active
  const handleUpdateActive = (id: string, active: boolean) => {
    // when the item is marked as completed, we need to store the user id
    const completedBy = active && session?.user?.name ? session.user.name : null;
    updateActiveMutate({ id: id, active: !active, completedBy: completedBy });
  }

  return (
    <>
      <div className="w-96 mx-auto space-y-4">
        {
          list?.map((item, index) => <ItemsListCard key={index} choresItem={item} updateActive={handleUpdateActive} deleteItem={openConfirmModal} />)
        }
      </div>
      <ConfirmModal confirmFunction={handleDeleteItem} isConfirmModalOpen={isConfirmModalOpen} setIsConfirmModalOpen={setIsConfirmModalOpen} confirmFunctionText={"Delete"}>
        <p>You are about to delete this item?</p>
      </ConfirmModal>
    </>
  );
}
