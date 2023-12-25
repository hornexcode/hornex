import {
  Cloud,
  CreditCard,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
  CogIcon,
} from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { GameID } from '@/pages/[platform]/[game]/tournaments/[id]';
import { Fragment } from 'react';
import { ChevronDown } from '../../atoms/icons';
import { LeagueOfLegendsLogo } from '../../atoms/icons/league-of-legends-icon';
import { LolFlatIcon } from '../../atoms/icons/lol-flat-icon';

export const ConnectedGameId = ({ gameId }: { gameId: GameID }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="group-item border-title text-title flex w-full items-center justify-center rounded border-2 px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <LolFlatIcon className="text-title mr-3 h-5 w-5" />
          <span>{gameId.nickname}</span>
          <ChevronDown className="ml-3 w-4" />
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
        <Menu.Items className="shadow-highlight-all shadow-card bg-light-dark absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-700 rounded text-sm  ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                    active ? 'text-dark bg-amber-500' : 'text-title'
                  } group flex w-full items-center px-4 py-2 text-sm`}
                >
                  Brasil
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'text-dark bg-amber-500' : 'text-title'
                  } group flex w-full items-center px-4 py-2 text-sm`}
                >
                  Payments
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
                  } group flex w-full items-center justify-center px-4 py-2 text-sm`}
                >
                  <CogIcon className="mr-2 h-4 w-4" />
                  Manage account
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
