import {
  HomeIcon,
  PlusCircleIcon,
  PlusIcon,
  TrophyIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid';
import classNames from 'classnames';
import Link from 'next/link';

import {
  CounterStrikeLogoIcon,
  LolIcon,
  SwordsIcon,
} from '@/components/ui/icons';
import routes from '@/config/routes';

export const Sidebar = ({ className }: { className?: string }) => {
  return (
    <div
      className={classNames(
        'fixed top-16 z-20 flex h-full w-16 flex-col border-r border-t border-slate-800 bg-light-dark px-2 shadow-2xl',
        className
      )}
    >
      <ul className="block space-y-3 py-2">
        <li>
          <Link
            href={`/${routes.compete}`}
            className="group flex h-[44px] cursor-pointer items-center justify-center rounded bg-amber-400 text-center shadow-lg transition-all hover:bg-slate-700"
          >
            <HomeIcon className="h-5 w-5 text-slate-700 shadow-xl group-hover:text-white" />
          </Link>
        </li>
        <li>
          <Link
            href={`/${routes.platform}/league-of-legends/${routes.tournaments}`}
            className="group flex h-[44px] cursor-pointer items-center justify-center rounded bg-slate-800 text-center shadow-lg transition-all hover:bg-slate-700"
          >
            <TrophyIcon className="h-4 w-4 text-slate-400 shadow-xl group-hover:text-white" />
          </Link>
        </li>
        <li title="Teams">
          <Link
            href={`/${routes.teams}`}
            className="group flex h-[44px] cursor-pointer items-center justify-center rounded bg-slate-800 text-center shadow-lg transition-all hover:bg-slate-700"
          >
            <UserGroupIcon className="h-4 w-4 text-slate-400 shadow-xl group-hover:text-white" />
          </Link>
        </li>

        <li>
          <Link
            href={`/${routes.compete}#available-games`}
            className="group flex h-[44px] cursor-pointer items-center justify-center rounded bg-slate-800 text-center shadow-lg transition-all hover:bg-slate-700"
          >
            <SwordsIcon className="h-4 w-4 fill-slate-400 shadow-xl group-hover:fill-white" />
          </Link>
        </li>
      </ul>
      <div className="h-[1.5px] w-[36px] self-center rounded-md bg-slate-800"></div>
      <ul className="block space-y-3 py-2">
        <li>
          <Link
            href={`/${routes.platform}/league-of-legends/${routes.tournaments}`}
            className="group flex h-[44px] cursor-pointer items-center justify-center rounded bg-slate-800 text-center shadow-lg transition-all hover:bg-slate-700"
          >
            <LolIcon className="w-4 fill-slate-400 shadow-xl group-hover:fill-white" />
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="group flex h-[44px] cursor-pointer items-center justify-center rounded bg-slate-800 text-center shadow-lg transition-all hover:bg-slate-700"
          >
            <CounterStrikeLogoIcon className="fill-slate-400 p-2 shadow-xl group-hover:fill-white" />
          </Link>
        </li>
        <li>
          <Link
            href={`/${routes.compete}`}
            className="group flex h-[42px] cursor-pointer items-center justify-center rounded bg-dark text-center shadow-lg ring-2 ring-slate-800 hover:ring-slate-700"
          >
            <PlusIcon className="w-4 rounded-sm bg-slate-800 fill-dark group-hover:bg-slate-700" />
          </Link>
        </li>
      </ul>
    </div>
  );
};
