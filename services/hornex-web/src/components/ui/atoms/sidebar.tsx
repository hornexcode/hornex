import routes from '@/config/routes';
import { dataLoader } from '@/lib/request';
import { useNotification } from '@/lib/websocket';
import { useWebSocketContext } from '@/websocket/context';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { FileBadge, Home, SwordsIcon, Users2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';

const { useData: useCountUserInvites } = dataLoader<number>('countUserInvites');

export const Sidebar = ({ className }: { className?: string }) => {
  const { notifications: generalNotifications } = useNotification();
  const notifications = React.useMemo(
    () => generalNotifications.filter((n) => n.type === 'invite'),
    [generalNotifications]
  );

  const { data: invitesNum, mutate } = useCountUserInvites({
    status: 'pending',
  });

  const { addListener } = useWebSocketContext();

  useEffect(() => {
    addListener('team_invitation', (_) => {
      mutate();
    });
  }, []);

  return (
    <div
      className={classNames(
        'bg-light-dark shadow-card fixed top-14 z-20 flex h-full w-[180px] flex-col  border-r border-zinc-700 p-4',
        className
      )}
    >
      <div className="flex items-center">
        <div className="text-title mb-8 flex h-[20] w-[180px] items-center text-sm font-bold">
          MENU OPTIONS
        </div>
      </div>
      <ul className="flex w-full flex-col space-y-2 text-xs">
        <li className="">
          <Link href={`/`} className="group cursor-pointer transition-all">
            <div className="mb-2 flex items-center rounded-lg">
              <div>
                <Home className="mr-4 h-4 w-4 text-white shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title text-sm">Home</span>
            </div>
          </Link>
        </li>
        <li className="">
          <Link
            href={`/${routes.compete}`}
            className="group cursor-pointer transition-all"
          >
            <div className="mb-2 flex items-center rounded-lg">
              <div>
                <SwordsIcon className="mr-4 h-4 w-4 text-white shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title text-sm">Compete</span>
            </div>
          </Link>
        </li>
        <li className="">
          <Link
            href={`/${routes.compete}`}
            className="group cursor-pointer transition-all"
          >
            <div className="mb-2 flex items-center rounded-lg">
              <div>
                <FileBadge className="mr-4 h-4 w-4 text-white shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title text-sm">Registrations</span>
            </div>
          </Link>
        </li>
        <li className="">
          <Link
            href={`/${routes.compete}`}
            className="group cursor-pointer transition-all"
          >
            <div className="mb-2 flex items-center rounded-lg">
              <div>
                <Users2 className="mr-4 h-4 w-4 text-white shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title text-sm">Teams</span>
            </div>
          </Link>
        </li>
        <li className="">
          <Link
            href={`/${routes.compete}`}
            className="group cursor-pointer transition-all"
          >
            <div className="mb-2 flex items-center rounded-lg">
              <div>
                <Cog6ToothIcon className="mr-4 h-4 w-4 text-white shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title text-sm">Organize a tournament</span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};
