'use client';
import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ComputerDesktopIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';
import { FilterIcon } from 'lucide-react';
import { Fragment } from 'react';

export const TournamentRoundFilter = () => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="border-border bg-medium-dark group flex h-full min-w-[8rem] items-center justify-center gap-3 rounded border p-2 font-medium text-white hover:cursor-pointer">
        <div className="pl-2">
          <FilterIcon className="w-4" />
        </div>
        <span>Filter by round</span>
        <div className="pr-2">
          <ChevronDownIcon className="w-6" />
        </div>
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
        <Menu.Items className="shadow-highlight-all divide-border bg-medium-dark absolute left-0 z-20 mt-2 w-full origin-top-right divide-y rounded ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-dark text-slate-200' : 'text-slate-200'
                  } bg-medium-dark flex w-full items-center justify-between gap-3 rounded p-2 font-medium text-white`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <ComputerDesktopIcon className="w-6 rounded bg-sky-400 p-1" />
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
                    active ? 'bg-dark text-slate-200' : 'text-slate-200'
                  } bg-medium-dark flex w-full items-center justify-between gap-3 rounded p-2 text-white`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">Round 1</span>
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
