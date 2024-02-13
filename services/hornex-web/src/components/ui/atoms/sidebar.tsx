import { LeagueOfLegendsLogo } from './icons/league-of-legends-icon';
import { LolFlatIcon } from './icons/lol-flat-icon';
import { LolIcon } from '@/components/ui/atoms/icons';
import routes from '@/config/routes';
import { dataLoader } from '@/lib/request';
import { useNotification } from '@/lib/websocket';
import { useWebSocketContext } from '@/websocket/context';
import {
  Cog6ToothIcon,
  HomeIcon,
  HomeModernIcon,
  TrophyIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid';
import classNames from 'classnames';
import {
  Home,
  LayoutDashboard,
  LayoutDashboardIcon,
  Sword,
  SwordsIcon,
  Users2,
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
        'bg-medium-dark shadow-card fixed z-20 flex h-full w-[180px] flex-col  border-r border-zinc-700 p-4',
        className
      )}
    >
      <div className="text-title h-[20] text-xl font-bold">HORNEX</div>
      <ul className="flex w-full flex-col space-y-2 py-8 text-xs">
        <li className="">
          <Link
            href={`/${routes.compete}`}
            className="group cursor-pointer transition-all"
          >
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
              <span className="text-title text-sm">Tournaments</span>
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
