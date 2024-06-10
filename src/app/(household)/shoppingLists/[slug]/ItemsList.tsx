"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import ItemsListCard from "./ItemsListCard";
import ConfirmModal from "@/app/_components/modals/ConfirmModal";
import type { ListItemResponseType } from "@/types/index";


export default function ItemsList({ list }: { list: ListItemResponseType }) {
  const router = useRouter();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string>("");
  
  // mutate the item to be deleted
  const { mutate: deleteMutate } = api.shoppingListItem.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  // mutate the item to be active or not active
  const { mutate: updateActiveMutate } = api.shoppingListItem.updateActive.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  // open and close the confirm modal.
  // wrapper function to open the modal and set the item to delete
  const openConfirmModal = (id: string) => {
    setIsConfirmModalOpen(true);
    setItemToDelete(id);
  }

  // callback function to handle the user action, passed to modal as prop
  const handleDeleteItem = (userAction: boolean) => {
    // removes the item from the database
    if (userAction) {
      deleteMutate({ id: itemToDelete });
    }
    setIsConfirmModalOpen(false);
  };

  // update the item to active or not active
  // the item will have a strike through if it is not active
  const handleUpdateActive = (id: string, active: boolean) => {
    updateActiveMutate({ id: id, active: !active });
  }

  return (
    <>
      {
        list.items?.map((item, index) => <ItemsListCard key={index} shoppingItem={item} updateActive={handleUpdateActive} deleteItem={openConfirmModal} />)
      }
      <ConfirmModal onModalClose={handleDeleteItem} openModal={isConfirmModalOpen}>
        <p>You are about to delete this item?</p>
      </ConfirmModal>
    </>
  );
}