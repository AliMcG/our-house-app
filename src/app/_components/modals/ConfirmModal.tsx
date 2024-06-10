import { useEffect, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import Button from '../Button'


export default function ConfirmModal({ 
  children,
  onModalClose,
  openModal,
}: { 
  children: React.ReactNode;
  onModalClose: (userAction: boolean) => void;
  openModal: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  // userAction is a boolean, true if the user confirms the action, false if the user cancels the action
  function handleClose(userAction: boolean) {
    // regardless of user action, close dialog
    setIsOpen(false);
    // use callback to handle action
    onModalClose(userAction);
  }

  useEffect(() => {
    if (!isOpen && openModal) {
      setIsOpen(openModal);
    }
  }, [openModal, isOpen]);

  return (
    <Transition appear show={isOpen}>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 transform-[scale(95%)]"
              enterTo="opacity-100 transform-[scale(100%)]"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 transform-[scale(100%)]"
              leaveTo="opacity-0 transform-[scale(95%)]"
            >
              <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                <DialogTitle className="font-bold">Are you sure?</DialogTitle>
                <p>{children}</p>
                <div className="flex gap-4">
                  <Button onClick={() => handleClose(false)}>Cancel</Button>
                  <Button onClick={() => handleClose(true)}>Delete</Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}