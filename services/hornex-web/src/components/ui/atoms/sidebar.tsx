import { LeagueOfLegendsLogo } from './icons/league-of-legends-icon';
import { LolFlatIcon } from './icons/lol-flat-icon';
import { LolIcon } from '@/components/ui/atoms/icons';
import routes from '@/config/routes';
import { dataLoader } from '@/lib/request';
import { useNotification } from '@/lib/websocket';
import { useWebSocketContext } from '@/websocket/context';
import {
  HomeIcon,
  HomeModernIcon,
  TrophyIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid';
import classNames from 'classnames';
import {
  LayoutDashboard,
  LayoutDashboardIcon,
  Sword,
  SwordsIcon,
} from 'lucide-react';
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
        'bg-medium-dark shadow-card fixed top-14 z-20 flex h-full w-[54px] flex-col items-center border-r border-zinc-700 p-4 text-center',
        className
      )}
    >
      <ul className="flex flex-col items-center space-y-2 py-2 text-xs">
        <li className="">
          <Link
            href={`/${routes.compete}`}
            className="group cursor-pointer text-center transition-all"
          >
            <div className="bg-light-dark mb-2 flex h-[36px] w-[36px]  items-center justify-center rounded-lg">
              <HomeModernIcon className="h-6 w-6 text-white shadow-xl transition-transform group-hover:scale-110" />
            </div>
          </Link>
        </li>
        <li className="">
          <Link
            href={`/${routes.platform}/league-of-legends/${routes.tournaments}`}
            className="group flex cursor-pointer flex-col items-center rounded-md  transition-all"
          >
            <div className="flex h-[36px] w-[36px] items-center justify-center  rounded-md ">
              <SwordsIcon className="h-6 w-6 text-slate-400 shadow-xl group-hover:scale-110 group-hover:text-white" />
            </div>
          </Link>
        </li>
        <li>
          <Link
            href={`/${routes.teams}`}
            className="hover:bg-light-dark transition-alg group cursor-pointer flex-col items-center justify-center rounded  text-center"
          >
            <div className="flex h-[36px] w-[36px] items-center justify-center  rounded-md ">
              <UserGroupIcon className="h-6 w-6 text-slate-400 shadow-xl group-hover:scale-110 group-hover:text-white" />
            </div>
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

      {/* <ul className="block space-y-3 py-2">
        <li>
          <Link
            href={`/${routes.platform}/league-of-legends/${routes.tournaments}`}
            className="group flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded text-center transition-all hover:bg-liglg-dark"
          >
            <LolFlatIcon className="w-7 fill-slate-400 shadow-xl group-hover:fill-white" />
          </Link>
        </li>
      </ul> */}
    </div>
  );
};
