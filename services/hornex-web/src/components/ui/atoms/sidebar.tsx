import { LangToggler } from '../molecules';
import { LolFlatIcon } from './icons/lol-flat-icon';
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
        'bg-medium-dark shadow-card fixed top-[calc(4rem+2px)] z-50 flex h-full w-[250px] flex-col border-r border-zinc-700 px-8 py-4',
        className
      )}
    >
      <div className="text-title mb-6 flex h-[20] w-[200px] items-center font-extrabold">
        <LolFlatIcon className="mr-4 h-8 w-8" />
      </div>
      <ul className="flex w-full flex-col space-y-2 text-lg">
        <li className="">
          <Link href={`/`} className="group cursor-pointer transition-all">
            <div className="mb-2 flex items-center rounded-lg">
              <div>
                <Home className="text-brand mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title">{t('sidebar.home')}</span>
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
                <SwordsIcon className="text-brand mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title">{t('sidebar.compete')}</span>
            </div>
          </Link>
        </li>
        {/* <li className="">
          <Link
            href={`/${routes.compete}`}
            className="group cursor-pointer transition-all"
          >
            <div className="mb-2 flex items-center rounded-lg">
              <div>
                <FileBadge className="text-brand mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title">{t('sidebar.registrations')}</span>
            </div>
          </Link>
        </li> */}
        {/* <li className="">
          <Link
            href={`/${routes.compete}`}
            className="group cursor-pointer transition-all"
          >
            <div className="flex items-center rounded-lg">
              <div>
                <Users2 className="text-brand mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title">{t('sidebar.teams')}</span>
            </div>
          </Link>
        </li> */}
        <li className="">
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
                <Cog6ToothIcon className="text-brand mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title">{t('sidebar.organize')}</span>
            </div>
          </Link>
        </li>
        <li className="">
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
                <BadgeHelpIcon className="text-brand mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110" />
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
