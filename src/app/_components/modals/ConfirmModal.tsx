import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import Button from '../Button'

export default function ConfirmModal({ 
  children,
  confirmFunction,
  confirmFunctionText,
  isConfirmModalOpen,
  setIsConfirmModalOpen
}: { 
  children: React.ReactNode;
  confirmFunction: () => void;
  confirmFunctionText: string;
  setIsConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isConfirmModalOpen: boolean;
}) {

  return (
    <Transition appear show={isConfirmModalOpen}>
      <Dialog open={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} className="relative z-50">
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
                {children}
                <div className="flex gap-4">
                  <Button onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
                  <Button onClick={() => confirmFunction()} data-cy={`confirmModal-${confirmFunctionText}`}>{confirmFunctionText}</Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}