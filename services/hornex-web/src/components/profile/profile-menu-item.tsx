'use client';

import { LoggedUser } from '@/domain';
import { Menu, Transition } from '@headlessui/react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import { ChevronDownIcon, UserIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { destroyCookie } from 'nookies';
import { Fragment } from 'react';

export default function ProfileMenuItem({ user }: { user: LoggedUser }) {
  const handleLogout = async () => {
    destroyCookie(null, 'hx');
    await signOut();
    if (window !== undefined) {
      window.location.href = '/';
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="group-item flex w-full items-center justify-center rounded-md bg-opacity-20 px-4 py-2 font-semibold hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {/* <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar> */}
          <div className="flex items-center px-4 py-2">
            <UserIcon className="mr-2 h-4 w-4" />
            {user.email}
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </div>
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
        <Menu.Items className="shadow-highlight-all border-border bg-light-dark shadow-dark divide-border absolute right-0 mt-2 w-56 origin-top-right divide-y rounded border font-medium ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-brand text-dark' : 'text-slate-200'
                  } group flex w-full items-center px-4 py-2`}
                >
                  <UserIcon className="mr-2 w-4" /> Account
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="py-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? 'bg-brand text-dark' : 'text-slate-200'
                  } group flex w-full items-center px-4 py-2`}
                >
                  <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
