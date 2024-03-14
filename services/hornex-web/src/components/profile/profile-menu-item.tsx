'use client';
import { LoggedUser } from '@/domain';
import { Menu, Transition } from '@headlessui/react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import { ChevronDownIcon, UserIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Fragment } from 'react';

export default function ProfileMenuItem({ user }: { user: LoggedUser }) {
  const handleLogout = async () => {
    await signOut();
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
        <Menu.Items className="shadow-highlight-all bg-medium-dark shadow-dark divide-background absolute right-0 mt-2 w-56 origin-top-right divide-y rounded ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-2">
            <Menu.Item>
              <div className="px-4">
                <div className="text-semibold text-slate-200">{user.name}</div>
                {/* <div className="text-slate-400">{user.email}</div> */}
              </div>
            </Menu.Item>
          </div>
          {/* <div className="py-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-slate-900 text-slate-200' : 'text-slate-200'
                  } group flex w-full items-center px-4 py-2`}
                >
                  Account
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-slate-900 text-slate-200' : 'text-slate-200'
                  } group flex w-full items-center px-4 py-2`}
                >
                  Settings
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-slate-900 text-slate-200' : 'text-slate-200'
                  } group flex w-full items-center px-4 py-2`}
                >
                  Payments
                </button>
              )}
            </Menu.Item>
          </div> */}
          <div className="py-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? 'bg-dark text-slate-200' : 'text-slate-200'
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

function EditInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function EditActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 4H12V12H4V4Z" fill="currentColor" strokeWidth="2" />
      <path d="M8 8H16V16H8V8Z" fill="currentColor" strokeWidth="2" />
    </svg>
  );
}

function DuplicateActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function ArchiveInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="currentColor"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="currentColor"
        strokeWidth="2"
      />
      <path d="M8 12H12" strokeWidth="2" />
    </svg>
  );
}

function ArchiveActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M8 12H12" strokeWidth="2" />
    </svg>
  );
}

function MoveInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" strokeWidth="2" />
      <path d="M16 4L8 12" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" strokeWidth="2" />
    </svg>
  );
}

function MoveActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" stroke="currentColor" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="currentColor" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function DeleteInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="currentColor"
        strokeWidth="2"
      />
      <path d="M3 6H17" strokeWidth="2" />
      <path d="M8 6V4H12V6" strokeWidth="2" />
    </svg>
  );
}

function DeleteActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="currentColor" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
