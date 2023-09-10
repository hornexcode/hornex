'use client';

import { useState } from 'react';
import cn from 'classnames';
import { SearchIcon } from '@/components/ui/icons/search';
import Input from '@/components/ui/form/input';
import { ProfileIcon } from '@/components/ui/icons/profile-icon';
import { XMarkIcon } from '@/components/ui/icons/x-mark-icon';

export const collectionList = [
  {
    name: 'Iron flower',
    value: 'iron-flower',
  },
  {
    name: 'Creative web',
    value: 'creative-web',
  },
  {
    name: 'Art in binary',
    value: 'art-in-binary',
  },
  {
    name: 'Sound of wave',
    value: 'sound-of-wave',
  },
  {
    name: 'Pixel art',
    value: 'pixel-art',
  },
];

interface CollectionSelectTypes {
  onSelect: (value: string) => void;
}

export default function TeamSearchList({ onSelect }: CollectionSelectTypes) {
  let [searchKeyword, setSearchKeyword] = useState('');
  let coinListData = collectionList;
  if (searchKeyword.length > 0) {
    coinListData = collectionList.filter(function (item) {
      const name = item.name;
      return (
        name.match(searchKeyword) ||
        (name.toLowerCase().match(searchKeyword) && name)
      );
    });
  }
  function handleSelectedCoin(value: string) {
    onSelect(value);
    setSearchKeyword('');
  }
  return (
    <div className="shadow-large relative w-full rounded-lg text-sm">
      <div className="relative">
        <SearchIcon className="absolute left-6 h-full text-gray-700 dark:text-white" />
        <Input
          inputClassName="pl-14 !mt-0"
          type="search"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>
      <ul
        role="listbox"
        className={cn(
          'absolute top-12 z-30 mt-1 w-full rounded bg-gray-800 py-3 transition-all',
          {
            hidden: searchKeyword.length === 0,
          },
        )}
      >
        {coinListData.length > 0 ? (
          coinListData.map((item, index) => (
            <li
              key={index}
              role="listitem"
              tabIndex={index}
              onClick={() => handleSelectedCoin(item.value)}
              className="mb-1 flex cursor-pointer items-center gap-3 px-6 py-1.5 outline-none  hover:bg-gray-700 focus:bg-gray-600"
            >
              <div className="flex flex-col">
                <span className="text-sm tracking-tight text-white">
                  {item.name}
                </span>
                <span className="text-xs font-medium tracking-tight text-gray-400">
                  email@example.com
                </span>
              </div>
            </li>
          ))
        ) : (
          <li className="px-6 py-5 text-center">
            <h3 className="mb-2 text-sm text-gray-600 dark:text-white">
              Ops! not found
            </h3>
          </li>
        )}
      </ul>
    </div>
  );
}
