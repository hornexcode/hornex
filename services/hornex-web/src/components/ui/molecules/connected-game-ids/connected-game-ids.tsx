import { ChevronDown } from '../../atoms/icons';
import { LolFlatIcon } from '../../atoms/icons/lol-flat-icon';
import { GameId } from '@/lib/models/Account';
import { game } from '@/lib/models/types';
import { Menu, Transition } from '@headlessui/react';
import { CogIcon, PlusCircleIcon } from 'lucide-react';
import { Fragment } from 'react';

export const ConnectedGameIds = ({ gameIds }: { gameIds: GameId[] }) => {
  return (
    <Menu as="div" className="relative z-10 inline-block text-left">
      <div>
        <Menu.Button className="group-item bg-title text-dark flex w-full items-center justify-center rounded px-4 py-1 font-medium focus:outline-none ">
          <LolFlatIcon className="text-dark mr-3 h-5 w-5" />
          <span>connected</span>
          <ChevronDown className="ml-3 w-4" />
        </Menu.Button>
      </div>
      {gameIds.map((gameId, key) => (
        <Transition
          key={key}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="shadow-highlight-all shadow-card bg-light-dark absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-700 rounded ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="text-title px-4 py-2">
              {gameId.game === 'league-of-legends' && (
                <span>League of Legends</span>
              )}
            </div>
            <div className="py-2">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? 'text-dark bg-amber-500'
                        : 'text-title bg-medium-dark'
                    } group flex w-full items-center px-4 py-2`}
                  >
                    {gameId.nickname}
                    <span className="text-dark ml-2 rounded-full bg-gray-200 px-2 text-xs">
                      connected
                    </span>
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'text-dark bg-amber-500' : 'text-title'
                    } group flex w-full items-center px-4 py-2`}
                  >
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    Connect another account
                  </button>
                )}
              </Menu.Item>
            </div>

            <div className="py-2">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-dark text-slate-200' : 'text-slate-200'
                    } group flex w-full items-center justify-center px-4 py-2 `}
                  >
                    <CogIcon className="mr-2 h-4 w-4" />
                    Manage account
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      ))}
    </Menu>
  );
};
