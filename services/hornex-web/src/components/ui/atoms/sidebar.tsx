import { LangToggler } from '../molecules';
import { Separator } from '../separator';
import routes from '@/config/routes';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { FileBadge, Home, SwordsIcon, Users2 } from 'lucide-react';
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
        'bg-light-dark shadow-card fixed top-14 z-20 flex h-full w-[180px] flex-col  border-r border-zinc-700 p-4',
        className
      )}
    >
      <div className="flex items-center">
        <div className="text-title mb-8 flex h-[20] w-[180px] items-center text-sm font-bold uppercase">
          {t('sidebar.title')}
        </div>
      </div>
      <ul className="flex w-full flex-col space-y-2 text-xs">
        <li className="">
          <Link href={`/`} className="group cursor-pointer transition-all">
            <div className="mb-2 flex items-center rounded-lg">
              <div>
                <Home className="mr-4 h-4 w-4 text-white shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title text-sm">{t('sidebar.home')}</span>
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
              <span className="text-title text-sm">{t('sidebar.compete')}</span>
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
              <span className="text-title text-sm">
                {t('sidebar.registrations')}
              </span>
            </div>
          </Link>
        </li>
        <li className="">
          <Link
            href={`/${routes.compete}`}
            className="group cursor-pointer transition-all"
          >
            <div className="flex items-center rounded-lg">
              <div>
                <Users2 className="mr-4 h-4 w-4 text-white shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title text-sm">{t('sidebar.teams')}</span>
            </div>
          </Link>
        </li>
      </ul>
      <Separator className="my-4" />
      <div className="flex items-center">
        <div className="text-body mb-4 flex h-[20] w-[180px] items-center text-sm font-bold">
          Organizers
        </div>
      </div>
      <ul>
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
                <Cog6ToothIcon className="mr-4 h-4 w-4 text-white shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-title text-sm">
                {t('sidebar.organize')}
              </span>
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
