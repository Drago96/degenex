"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MdAccountCircle } from "react-icons/md";

import LogoutLink from "../auth/logout-link";

export default function UserActions() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="mr-2 px-4 py-2 text-primary-contrastText focus:outline-none dark:text-primary-contrastText-dark">
          <MdAccountCircle size={30} />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-primary-dark">
          <div className="py-1">
            <Menu.Item>{() => <LogoutLink />}</Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
