'use client';

import Button from '@/components/ui/button';
import Input from '@/components/ui/form/input';
import { ProfileIcon } from '@/components/ui/icons/profile-icon';
import { SearchIcon } from '@/components/ui/icons/search';
import { XMarkIcon } from '@/components/ui/icons/x-mark-icon';
import Loader from '@/components/ui/loader';
import { dataLoader } from '@/lib/api';
import { User } from '@/lib/hx-app/types';
import { GetUsersResponse } from '@/lib/hx-app/types/rest/get-users';
import cn from 'classnames';
import { useEffect, useState } from 'react';

const { get: getUsers } = dataLoader<GetUsersResponse>('getUsers');
const SEARCH_DELAY = 1000 * 1.5; // 3 secs

export default function UserSearchList() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [users, setUsers] = useState<User[] | null>();
  const [selectedUser, setSelectedUser] = useState<User | null>();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 1. Select the user from the searched list
   * 2. Clean search input
   * 3. Clean searched list to remore the component from screen
   */
  const handleSelectedUser = async (user: User) => {
    setSelectedUser(user);
    setSearchKeyword('');
    setUsers(null);
  };

  const handleSearch = async (value: string) => {
    const { data } = await getUsers({ email: value });
    setIsLoading(false);
    setUsers(data);
  };

  useEffect(() => {
    setIsLoading(true);

    // Prevent searching for empty-string and clear list if search is empty-string
    if (!searchKeyword) {
      return setUsers(null);
    }

    // Set a callback to execute the search when SEARCH_DELAY has passed
    const timerId = setTimeout(() => {
      handleSearch(searchKeyword);
    }, SEARCH_DELAY);

    // Clear the `timer` when component gets unmounted
    return () => clearTimeout(timerId);
  }, [searchKeyword]);

  return (
    <div className="shadow-large xs:w-[560px] relative w-full rounded-lg text-sm">
      {/* Restrict the search input to only render when there's no selected user */}
      {!selectedUser && (
        <div className="relative">
          <SearchIcon className="absolute left-6 h-full text-gray-700 dark:text-white" />
          <Input
            inputClassName="pl-14"
            type="search"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      )}
      <ul
        role="listbox"
        className={cn(
          'mt-1 w-full rounded-lg bg-gray-800 py-3 transition-all',
          {
            hidden: searchKeyword.length === 0,
          }
        )}
      >
        {!isLoading && users && users.length > 0 ? (
          users.map((user, index) => (
            <li
              key={user.id}
              role="listitem"
              tabIndex={index}
              onClick={() => handleSelectedUser(user)}
              className="mb-1 flex cursor-pointer items-center gap-3 px-6 py-1.5 outline-none  hover:bg-gray-700 focus:bg-gray-600"
            >
              <div className="flex flex-col">
                <span className="text-sm tracking-tight text-white">
                  {user.name}
                </span>
                <span className="text-xs font-medium tracking-tight text-gray-400">
                  {user.email}
                </span>
              </div>
            </li>
          ))
        ) : isLoading ? (
          <li className="flex items-center justify-center p-3 pb-4 text-center">
            <Loader />
          </li>
        ) : (
          <li className="px-6 py-5 text-center">
            <h3 className="mb-2 text-sm text-gray-600 dark:text-white">
              Ops! Any user found for <strong>{searchKeyword}</strong>
            </h3>
          </li>
        )}
      </ul>
      <div className="flex flex-wrap py-3">
        {selectedUser && (
          <SelectedPlayer
            name={selectedUser.name}
            email={selectedUser.email}
            onRemove={() => setSelectedUser(null)}
          />
        )}
      </div>

      <Button
        onClick={() => 'implemente invite'}
        size="small"
        variant="solid"
        shape="rounded"
        color="success"
        className="w-full"
      >
        Invite
      </Button>
    </div>
  );
}

type SelectedPlayerProps = {
  name: string;
  email: string;
  onRemove: () => void;
};

const SelectedPlayer = ({ name, email, onRemove }: SelectedPlayerProps) => (
  <div className="mb-2 mr-2 flex h-12 w-full items-center rounded-full border border-sky-800 bg-sky-900 p-2 text-white">
    <div className="flex w-full justify-items-stretch">
      {/* Atom: ProfileComponent */}
      <div className="relative h-7 w-7 overflow-hidden rounded-full bg-gray-600">
        <ProfileIcon className="absolute -left-1 h-9 w-9 text-gray-400" />
      </div>
      <div className="mx-3 flex flex-col justify-center">
        <h4 className=" text-xs font-bold leading-[10px] tracking-tight text-sky-200">
          {name}
        </h4>
        <span className="text-xs font-medium leading-tight text-sky-100">
          {email}
        </span>
      </div>
      <div className="ml-auto block h-6 w-6 self-center">
        <button onClick={onRemove}>
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  </div>
);
