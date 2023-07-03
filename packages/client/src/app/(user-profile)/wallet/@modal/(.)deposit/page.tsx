"use client";

import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

import DepositForm from "@/components/wallet/deposit-form";
import { useInteractiveModal } from "@/hooks/use-interactive-modal";

export default function DepositModal() {
  const router = useRouter();
  useInteractiveModal();

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => router.back()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Backdrop>
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Dialog.Backdrop>
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex w-full max-w-md transform flex-col gap-3 overflow-hidden rounded bg-primary p-6 text-left align-middle shadow-xl transition-all dark:bg-primary-dark">
                <DepositForm variant="modal" />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
