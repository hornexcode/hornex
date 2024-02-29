import { LangToggler } from '../molecules';
import routes from '@/config/routes';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { BadgeHelpIcon, FileBadge, Home, SwordsIcon } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const Sidebar = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const { status } = useSession();

  return (
    <div
      className={classNames(
        'bg-background fixed top-[calc(4rem)] z-50 flex h-full w-[230px] flex-col border-r border-dashed border-neutral-700 p-2',
        className
      )}
    >
      {/* <div className="text-title mb-6 flex h-[20] w-[200px] items-center font-extrabold">
        <LolFlatIcon className="mr-4 h-8 w-8" />
      </div> */}
      <ul className="mt-4 flex w-full flex-col font-[500] tracking-wide">
        {/* <li className="">
          <Link href={`/`} className="group cursor-pointer transition-all">
            <div className="mb-2 flex items-center rounded-lg">
              <div>
                <Home className="text-brand mr-4 h-6 w-6 shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title">{t('sidebar.home')}</span>
            </div>
          </Link>
        </li> */}
        <li className="bg-dark/50 relative rounded p-3 px-4">
          <div className="bg-brand absolute right-0 top-[calc(50%-10px)] h-[20px] w-1"></div>
          <Link
            href={`/${routes.compete}`}
            className="group cursor-pointer transition-all"
          >
            <div className="flex items-center rounded-lg">
              <div>
                <SwordsIcon className="text-brand mr-4 h-6 w-6 shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-brand">{t('sidebar.compete')}</span>
            </div>
          </Link>
        </li>
        <li className="p-3 px-4">
          <Link
            href={`/${
              status === 'authenticated'
                ? routes.admin.tournaments
                : routes.signIn
            }`}
            className="group cursor-pointer transition-all"
          >
            <div className="flex items-center rounded-lg">
              <div>
                <Cog6ToothIcon className="text-title mr-4 h-6 w-6 shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title">{t('sidebar.organize')}</span>
            </div>
          </Link>
        </li>
        <li className="mb-2 px-4 py-2">
          <Link
            href={`/${
              status === 'authenticated'
                ? routes.admin.tournaments
                : routes.signIn
            }`}
            className="group cursor-pointer transition-all"
          >
            <div className="mb-2 flex items-center rounded-lg">
              <div>
                <BadgeHelpIcon className="text-title mr-4 h-6 w-6 shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title">Help</span>
            </div>
          </Link>
        </li>
      </ul>
      <div className="mt-auto pb-14">
        <LangToggler />
      </div>
    </div>
  );
};
