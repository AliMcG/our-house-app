// components/Modal.tsx
"use client";

import Modal from "@/app/_components/modals/Modal";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  closeModal: () => void;
}


export default function ModalConfirm({ 
  children,
  isOpen,
  closeModal
}: ModalProps) {

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
        {children}
    </Modal>
  );
};
