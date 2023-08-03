'use client';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ComputerDesktopIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';
import { XboxIcon } from '../ui/icons';

export const PlatformPicker = () => {
  return (
    <Menu as="div" className="relative h-full">
      <Menu.Button className="group flex h-full min-w-[8rem] items-center justify-center gap-3 rounded-lg bg-slate-800 p-3 text-sm tracking-tight text-white shadow-card hover:cursor-pointer">
        <span className="rounded-md bg-slate-600 p-1 transition-all group-hover:bg-slate-500">
          <PlusIcon className="w-4" />
        </span>
        <span>Select the platform</span>
        <ChevronDownIcon className="w-5" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="shadow-highlight-all absolute left-0 mt-2 w-full origin-top-right divide-y divide-slate-700 rounded-md bg-slate-800  ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-slate-900 text-slate-200' : 'text-slate-200'
                  } flex w-full items-center justify-between gap-3 rounded-lg bg-slate-800 p-2 text-sm tracking-tight text-white`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <ComputerDesktopIcon className="w-7 rounded-md bg-sky-400 p-1" />
                    <span>Desktop PC</span>
                  </div>
                  <ChevronRightIcon className="w-5" />
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-slate-900 text-slate-200' : 'text-slate-200'
                  } flex w-full items-center justify-between gap-3 rounded-lg bg-slate-800 p-2 text-sm tracking-tight text-white`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <XboxIcon className="w-7 rounded-md bg-green-500 fill-white p-1" />
                    <span>Xbox</span>
                  </div>
                  <ChevronRightIcon className="w-5" />
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
