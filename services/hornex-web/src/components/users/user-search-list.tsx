'use client';

import { TeamMemberListItem } from '../system-design/molecules/team-member-list-item';
import Input from '@/components/ui/form/input';
import { ProfileIcon } from '@/components/ui/icons/profile-icon';
import { SearchIcon } from '@/components/ui/icons/search';
import { XMarkIcon } from '@/components/ui/icons/x-mark-icon';
import { dataLoader } from '@/lib/api';
import { User } from '@/lib/hx-app/types';
import { GetUsersResponse } from '@/lib/hx-app/types/rest/get-users';
import cn from 'classnames';
import { useMemo, useState } from 'react';

const { useData: useSearchUsers } = dataLoader<GetUsersResponse>('searchUsers');

interface UserSearchListProps {
  onSelect: (value: string) => void;
}

export default function UserSearchList({ onSelect }: UserSearchListProps) {
  const { data } = useSearchUsers();
  const userList = useMemo(() => data, [data]);

  const [selectedUser, setSelectedUser] = useState<User | null>();
  const [searchKeyword, setSearchKeyword] = useState('');

  let users = userList;
  if (searchKeyword.length > 0) {
    users = users?.filter(function ({ email }) {
      return (
        email.match(searchKeyword) ||
        (email.toLowerCase().match(searchKeyword) && email)
      );
    });
  }

  function handleSelectedUser(user: User) {
    onSelect(user.id);
    setSelectedUser(user);
    setSearchKeyword('');
  }

  return (
    <div className="shadow-large relative w-full  rounded-lg text-sm">
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
        {users && users?.length > 0 ? (
          users?.map((user, index) => (
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
        ) : (
          // FIXME: need coin not found svg from designer
          <li className="px-6 py-5 text-center">
            <h3 className="mb-2 text-sm text-gray-600 dark:text-white">
              Ops! not found
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
    </div>
  );
}

type SelectedPlayerProps = {
  name: string;
  email: string;
  onRemove: () => void;
};
const SelectedPlayer = ({ name, email, onRemove }: SelectedPlayerProps) => (
  <div className="w-full">
    <TeamMemberListItem
      className="dark:bg-slate-800"
      member={{ id: '', name, email }}
      onRemove={onRemove}
    />
  </div>
);
