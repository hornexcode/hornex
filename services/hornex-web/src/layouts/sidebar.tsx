import { LangToggler } from '@/components/ui/molecules';
import routes from '@/config/routes';
import { cn } from '@/lib/utils';
import { Cog6ToothIcon, Cog8ToothIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import clsx from 'clsx';
import { BadgeHelpIcon, FileBadge, Home, SwordsIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const Sidebar = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const { status } = useSession();
  const router = useRouter();

  return (
    <div
      className={classNames(
        'bg-background fixed top-[calc(4rem)] z-50 flex h-full w-[230px] flex-col border-r border-dashed border-neutral-700 p-2',
        className
      )}
    >
      <ul className="mt-4 flex w-full flex-col text-lg font-[500] tracking-wide">
        <li
          className={cn(
            'relative rounded p-3 px-4',
            router.pathname === routes.compete && 'bg-dark/50 '
          )}
        >
          {router.pathname === routes.compete && (
            <div className="bg-brand absolute right-0 top-[calc(50%-10px)] h-[20px] w-1"></div>
          )}
          <Link
            href={`/${routes.compete}`}
            className="group cursor-pointer transition-all"
          >
            <div className="flex items-center rounded-lg">
              <div>
                <SwordsIcon
                  className={cn(
                    'text-title mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110',
                    router.pathname === routes.compete && 'text-brand'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-title',
                  router.pathname === routes.compete && 'text-brand'
                )}
              >
                {t('sidebar.compete')}
              </span>
            </div>
          </Link>
        </li>
        <li
          className={cn(
            'relative rounded p-3 px-4',
            router.pathname === routes.admin.tournaments && 'bg-dark/50 '
          )}
        >
          {router.pathname === routes.admin.tournaments && (
            <div className="bg-brand absolute right-0 top-[calc(50%-10px)] h-[20px] w-1"></div>
          )}
          <Link
            href={`/${routes.admin.tournaments}`}
            className="group cursor-pointer transition-all"
          >
            <div className="flex items-center rounded-lg">
              <div>
                <Cog8ToothIcon
                  className={cn(
                    'text-title mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110',
                    router.pathname === routes.admin.tournaments && 'text-brand'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-title',
                  router.pathname === routes.admin.tournaments && 'text-brand'
                )}
              >
                {t('sidebar.organize')}
              </span>
            </div>
          </Link>
        </li>
      </ul>
      <div className="mt-auto pb-20">
        <LangToggler />
      </div>
    </div>
  );
};
