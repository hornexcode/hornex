import { useModal } from '@/components/modal-views/context';
import Button from '@/components/ui/atoms/button';
import { ChevronDown } from '@/components/ui/atoms/icons';
import { LolFlatIcon } from '@/components/ui/atoms/icons/lol-flat-icon';
import { GameId } from '@/lib/models/Account';
import { dataLoader } from '@/lib/request';
import { Menu, Transition } from '@headlessui/react';
import { LogOut } from 'lucide-react';
import { Fragment } from 'react';

const { useData: useGameIdsQuery } = dataLoader<GameId[]>('getGameIds');
const { submit: disconnectGameId } = dataLoader<undefined>('disconnectGameId');

export const ConnectedGameIds = () => {
  const { openModal } = useModal();
  const { data: gameIds, error, isLoading, mutate } = useGameIdsQuery({});

  if (isLoading) {
    return (
      <Button isLoading size="small" shape="rounded">
        Loading
      </Button>
    );
  }

  if (error || !gameIds) {
    return (
      <Button disabled shape="rounded" size="small" color="danger">
        Could not load information
      </Button>
    );
  }

  const handleDisconnectGameId = async (id: string) => {
    const { error } = await disconnectGameId({ id });
    if (error) {
      console.error('Error disconnecting account', error);
    }
    mutate();
  };

  return (
    <Menu as="div" className="relative z-10 inline-block text-left">
      <div>
        {gameIds.length > 0 ? (
          <Menu.Button className="group-item bg-brand text-dark flex w-full items-center justify-center rounded px-4 py-2 font-medium focus:outline-none ">
            <LolFlatIcon className="text-dark mr-2 h-5 w-5" />
            <span>connected</span>
            <ChevronDown className="ml-3 w-4" />
          </Menu.Button>
        ) : (
          <Menu.Button
            onClick={() => openModal('CONNECT_ACCOUNT_VIEW')}
            className="group-item text-dark bg-brand flex w-full items-center justify-center rounded px-4 py-2 font-medium focus:outline-none "
          >
            <LolFlatIcon className="text-dark mr-2 h-5 w-5" />
            Connect riot account
          </Menu.Button>
        )}
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
          <Menu.Items className="shadow-highlight-all shadow-card bg-light-dark divide-border absolute right-0 mt-2 w-56 origin-top-right divide-y rounded ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="text-title px-4 py-2 font-bold">
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
                        ? 'text-dark bg-brand'
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
            </div>

            <div className="py-2">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleDisconnectGameId(gameId.id)}
                    className={`${
                      active ? 'bg-dark text-slate-200' : 'text-slate-200'
                    } group flex w-full items-center justify-center px-4 py-2 `}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
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
