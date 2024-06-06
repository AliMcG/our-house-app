"use client";

import React, { type ElementRef, useEffect, useRef } from 'react';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  closeModal: () => void;
}


export default function Modal({ 
  children,
  isOpen,
  closeModal
}: ModalProps) {
  const dialogRef = useRef<ElementRef<'dialog'>>(null);

  const onCloseModal = () => {
    dialogRef.current?.close();
    closeModal();
  };

  // TODO: Add a function to delete the item from the database
  const onDelete = () => {
    onCloseModal();
  }

  // keeps the modal open on component render
  useEffect(() => {
    // show the dialog as a modal
    if (!dialogRef.current?.open && isOpen) {
      dialogRef.current?.showModal();
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef}>
      <div>
        {children}
        <button onClick={onDelete}>Delete</button>
        <button onClick={onCloseModal} autoFocus>Cancel</button>
      </div>
    </dialog>
  );
};