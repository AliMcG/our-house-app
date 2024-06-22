"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import ItemsListCard from "./ItemsListCard";
import ConfirmDeleteModal from "@/app/_components/modals/ConfirmDeleteModal";
import type { ChoresListItemResponseType } from "@/types/index";
import { useSession } from "next-auth/react";


// TODO: Having issus with the chorsItem prop type, need to fix it

export default function ItemsList({ list }: { list: ChoresListItemResponseType }) {
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
    const completedBy = active && session?.user?.id ? session.user.id : null;
    updateActiveMutate({ id: id, active: !active, completedBy: completedBy });
  }

  return (
    <>
      {
        list.items?.map((item, index) => <ItemsListCard key={index} choresItem={item} updateActive={handleUpdateActive} deleteItem={openConfirmModal} />)
      }
      <ConfirmDeleteModal confirmDelete={handleDeleteItem} isConfirmModalOpen={isConfirmModalOpen} setIsConfirmModalOpen={setIsConfirmModalOpen}>
        <p>You are about to delete this item?</p>
      </ConfirmDeleteModal>
    </>
  );
}
