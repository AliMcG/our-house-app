"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import ItemsListCard from "./ItemsListCard";
import ConfirmDeleteModal from "@/app/_components/modals/ConfirmModal";
import type { ShoppingItem } from "@prisma/client";


export default function ItemsList({ list }: { list: ShoppingItem[] }) {
  const router = useRouter();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string>("");

  // mutate the item to be deleted
  const { mutate: deleteMutate } = api.shoppingListItem.delete.useMutation({
    onSuccess: () => {
      // lets make sure the modal is close and item to delete is removed from state
      setIsConfirmModalOpen(false);
      setItemToDelete("");
      router.refresh();
    },
  });

  // mutate the item to be active or not active
  const { mutate: updateActiveMutate } = api.shoppingListItem.updateActive.useMutation({
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
    updateActiveMutate({ id: id, active: !active });
  }

  return (
    <>
      <div className="w-96 mx-auto space-y-4">
        {
          list?.map((item, index) => <ItemsListCard key={index} shoppingItem={item} updateActive={handleUpdateActive} deleteItem={openConfirmModal} />)
        }
      </div>

      <ConfirmDeleteModal confirmFunction={handleDeleteItem} isConfirmModalOpen={isConfirmModalOpen} setIsConfirmModalOpen={setIsConfirmModalOpen} confirmFunctionText={"Delete"}>
        <p>You are about to delete this item?</p>
      </ConfirmDeleteModal>
    </>
  );
}
