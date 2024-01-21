import {
  CounterStrikeLogoIcon,
  LolIcon,
  SwordsIcon,
} from '@/components/ui/atoms/icons';
import routes from '@/config/routes';
import { GetInvitesResponse } from '@/lib/models/types';
import { dataLoader } from '@/lib/request';
import { useNotification } from '@/lib/websocket';
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
        'bg-medium-dark shadow-card fixed top-14 z-20 flex h-full flex-col items-center border-r border-gray-700 p-4 text-center md:w-20',
        className
      )}
    >
      <ul className="flex flex-col items-center space-y-3 py-2 text-xs">
        <li>
          <Link
            href={`/${routes.compete}`}
            className="group cursor-pointer text-center transition-all"
          >
            <div className="flex h-[38px] w-[38px] items-center justify-center  rounded-lg bg-slate-700">
              <HomeIcon className=" h-4 w-4 text-white shadow-xl" />
            </div>
            <span className="mx-auto">Home</span>
          </Link>
        </li>
        <li className="">
          <Link
            href={`/${routes.platform}/league-of-legends/${routes.tournaments}`}
            className="group flex cursor-pointer flex-col items-center rounded-lg  transition-all"
          >
            <div className="flex h-[45px] w-[45px] items-center justify-center  rounded-lg ">
              <TrophyIcon className="h-4 w-4 text-slate-400 shadow-xl group-hover:text-white" />
            </div>
            <span className="mx-auto">compete</span>
          </Link>
        </li>
        <li title="Teams" className="relative">
          <Link
            href={`/${routes.teams}`}
            className="group flex h-[45px] w-[45px] cursor-pointer flex-col items-center justify-center rounded text-center transition-all  hover:bg-slate-700"
          >
            <div className="flex h-[45px] w-[45px] items-center justify-center  rounded-lg ">
              <UserGroupIcon className="h-4 w-4 text-slate-400 shadow-xl group-hover:text-white" />
            </div>
            <span className="mx-auto">Teams</span>
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
      </ul>

      <ul className="block space-y-3 py-2">
        <li>
          <Link
            href={`/${routes.platform}/league-of-legends/${routes.tournaments}`}
            className="group flex h-[45px] w-[45px] cursor-pointer items-center justify-center rounded  text-center  transition-all hover:bg-slate-700"
          >
            <LolIcon className="w-4 fill-slate-400 shadow-xl group-hover:fill-white" />
          </Link>
        </li>
        {/* <li>
          <Link
            href="#"
            className="bg-dark roundedborder group flex h-[45px] w-[45px] cursor-pointer items-center justify-center   text-center  transition-all hover:bg-slate-700"
          >
            <CounterStrikeLogoIcon className="fill-slate-400 p-2 shadow-xl group-hover:fill-white" />
          </Link>
        </li> */}
      </ul>
    </div>
  );
};
