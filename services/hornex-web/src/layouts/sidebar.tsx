import { PodiumIcon } from '@/components/ui/atoms/icons';
import { LangToggler } from '@/components/ui/molecules';
import routes from '@/config/routes';
import { cn } from '@/lib/utils';
import classNames from 'classnames';
import { ListIcon, SwordsIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React from 'react';
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
      <div className="p-4">
        <h4 className="text-title px-2 text-sm font-bold uppercase">Main</h4>
        <ul className="mt-2 flex w-full flex-col font-normal">
          <li
            className={cn(
              'relative rounded p-2 px-3',
              router.pathname === routes.compete && 'bg-dark/50 '
            )}
          >
            {router.pathname === routes.compete && (
              <div className="bg-brand absolute right-0 top-[calc(50%-10px)] h-[20px] w-1"></div>
            )}
            <Link
              href={`${routes.compete}`}
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
              'relative rounded p-2 px-3',
              router.pathname === routes.registrations && 'bg-dark/50 '
            )}
          >
            {router.pathname === routes.registrations && (
              <div className="bg-brand absolute right-0 top-[calc(50%-10px)] h-[20px] w-1"></div>
            )}
            <Link
              href={`${routes.registrations}`}
              className="group cursor-pointer transition-all"
            >
              <div className="flex items-center rounded-lg">
                <div>
                  <ListIcon
                    className={cn(
                      'text-title mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110',
                      router.pathname === routes.registrations && 'text-brand'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-title',
                    router.pathname === routes.registrations && 'text-brand'
                  )}
                >
                  Registrations
                </span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
      <div className="p-4">
        <h4 className="text-title px-2 text-sm font-bold uppercase">
          Organizer
        </h4>
        <ul className="mt-2 flex w-full flex-col font-normal">
          <li
            className={cn(
              'relative rounded p-2 px-3',
              router.pathname === routes.admin.tournaments && 'bg-dark/50 '
            )}
          >
            {router.pathname === routes.admin.tournaments && (
              <div className="bg-brand absolute right-0 top-[calc(50%-10px)] h-[20px] w-1"></div>
            )}
            <Link
              href={`${routes.admin.tournaments}`}
              className="group cursor-pointer transition-all"
            >
              <div className="flex items-center rounded-lg">
                <div>
                  <PodiumIcon
                    className={cn(
                      'text-title mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110',
                      router.pathname === routes.admin.tournaments &&
                        'text-brand'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-title',
                    router.pathname === routes.admin.tournaments && 'text-brand'
                  )}
                >
                  Tournaments
                </span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
      <div className="mt-auto pb-20">
        <LangToggler />
      </div>
    </div>
  );
};
