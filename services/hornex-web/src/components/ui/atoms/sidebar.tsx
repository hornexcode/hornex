import {
  CounterStrikeLogoIcon,
  LolIcon,
  SwordsIcon,
} from '@/components/ui/atoms/icons';
import routes from '@/config/routes';
import { dataLoader } from '@/lib/api';
import { GetInvitesResponse } from '@/lib/models/types';
import { useNotification } from '@/lib/notification';
import { useWebSocketContext } from '@/websocket/context';
import {
  HomeIcon,
  PlusIcon,
  TrophyIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid';
import classNames from 'classnames';
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
        'bg-medium-dark shadow-card fixed top-14 z-20 flex h-full w-16 flex-col px-2',
        className
      )}
    >
      <ul className="block space-y-3 py-2">
        <li>
          <Link
            href={`/${routes.compete}`}
            className="group flex h-[45px] w-[45px] cursor-pointer items-center justify-center rounded bg-amber-500 text-center shadow-lg transition-all hover:bg-slate-700"
          >
            <HomeIcon className="h-5 w-5 text-white shadow-xl group-hover:text-white" />
          </Link>
        </li>
        <li>
          <Link
            href={`/${routes.platform}/league-of-legends/${routes.tournaments}`}
            className="bg-dark group flex h-[45px] w-[45px] cursor-pointer items-center justify-center rounded  text-center shadow-lg transition-all hover:bg-slate-700"
          >
            <TrophyIcon className="h-4 w-4 text-slate-400 shadow-xl group-hover:text-white" />
          </Link>
        </li>
        <li title="Teams" className="relative">
          <Link
            href={`/${routes.teams}`}
            className="bg-dark  group flex h-[45px] w-[45px] cursor-pointer items-center justify-center rounded  text-center shadow-lg transition-all  hover:bg-slate-700"
          >
            <UserGroupIcon className="h-4 w-4 text-slate-400 shadow-xl group-hover:text-white" />
          </Link>
          {/* {!!notifications.filter((n) => n.type === 'invite').length && ( */}
          {!!invitesNum && (
            <div>
              <span className="sr-only">Notifications</span>
              <div className="absolute -right-2 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-white bg-red-500 font-bold text-[11x] text-white dark:border-gray-900">
                {invitesNum}
              </div>
            </div>
          )}
        </li>

        <li>
          <Link
            href={`/${routes.compete}#available-games`}
            className="bg-dark group flex h-[45px] w-[45px] cursor-pointer items-center justify-center rounded  text-center shadow-lg transition-all hover:bg-slate-700"
          >
            <SwordsIcon className="h-4 w-4 fill-slate-400 shadow-xl group-hover:fill-white" />
          </Link>
        </li>
      </ul>
      <div className="bg-dark h-[1.5px] w-[36px] self-center rounded-md  "></div>
      <ul className="block space-y-3 py-2">
        <li>
          <Link
            href={`/${routes.platform}/league-of-legends/${routes.tournaments}`}
            className="bg-dark group flex h-[45px] w-[45px] cursor-pointer items-center justify-center rounded  text-center shadow-lg transition-all hover:bg-slate-700"
          >
            <LolIcon className="w-4 fill-slate-400 shadow-xl group-hover:fill-white" />
          </Link>
        </li>
        {/* <li>
          <Link
            href="#"
            className="bg-dark roundedborder group flex h-[45px] w-[45px] cursor-pointer items-center justify-center   text-center shadow-lg transition-all hover:bg-slate-700"
          >
            <CounterStrikeLogoIcon className="fill-slate-400 p-2 shadow-xl group-hover:fill-white" />
          </Link>
        </li> */}
      </ul>
    </div>
  );
};
