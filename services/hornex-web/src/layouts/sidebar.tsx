import routes from '@/config/routes';
import { cn } from '@/lib/utils';
import {
  BookmarkFilledIcon,
  PersonIcon,
  RocketIcon,
} from '@radix-ui/react-icons';
import classNames from 'classnames';
import { Swords, UserCircle2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const Sidebar = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div
      className={classNames(
        'border-border/50 fixed top-[calc(4rem+2px)] z-30 flex h-full w-[230px] flex-col border-r border-dashed p-2',
        className
      )}
    >
      <div className="p-4">
        <h4 className="text-body px-2 text-sm font-bold uppercase">Main</h4>
        <ul className="mt-2 flex w-full flex-col font-medium">
          <li
            className={cn(
              'relative mb-2 rounded p-1 px-3',
              router.pathname === routes.compete &&
                'bg-brand/20 border-brand/40 border'
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
                  <Swords
                    className={cn(
                      'text-body fill-body mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110 group-hover:text-white',
                      router.pathname === routes.compete &&
                        'text-brand fill-brand'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-body',
                    router.pathname === routes.compete && 'text-brand'
                  )}
                >
                  compete
                </span>
              </div>
            </Link>
          </li>
          <li
            className={cn(
              'relative rounded p-1.5 px-3',
              router.pathname === routes.registrations &&
                'bg-brand/20 border-brand/40 border ',
              !session && 'hidden'
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
                  <BookmarkFilledIcon
                    className={cn(
                      'text-body mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110 group-hover:text-white',
                      router.pathname === routes.registrations && 'text-brand'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-body',
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
      <div className={cn('p-4', !session && 'hidden')}>
        <h4 className="text-body px-2 text-sm font-bold uppercase">
          Organizer
        </h4>
        <ul className="mt-2 flex w-full flex-col font-medium">
          <li
            className={cn(
              'relative hidden rounded p-2 px-3',
              router.pathname === routes.admin.profile &&
                'bg-brand/20 border-brand/40 border '
            )}
          >
            {router.pathname === routes.admin.profile && (
              <div className="bg-brand absolute right-0 top-[calc(50%-10px)] h-[20px] w-1"></div>
            )}
            <Link
              href={`${routes.admin.profile}`}
              className="group cursor-pointer transition-all"
            >
              <div className="flex items-center rounded-lg">
                <div>
                  <PersonIcon
                    className={cn(
                      'text-body mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110 group-hover:text-white',
                      router.pathname === routes.admin.profile && 'text-brand'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-body',
                    router.pathname === routes.admin.profile && 'text-brand'
                  )}
                >
                  Profile
                </span>
              </div>
            </Link>
          </li>
          <li
            className={cn(
              'relative rounded p-1.5 px-3',
              router.pathname === routes.admin.tournaments &&
                'bg-brand/20 border-brand/40 border '
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
                  <RocketIcon
                    className={cn(
                      'text-body mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110 group-hover:text-white',
                      router.pathname === routes.admin.tournaments &&
                        'text-brand'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-body',
                    router.pathname === routes.admin.tournaments && 'text-brand'
                  )}
                >
                  Tournaments
                </span>
              </div>
            </Link>
          </li>
          <li
            className={cn(
              'relative rounded p-1.5 px-3',
              router.pathname === routes.admin.profile &&
                'bg-brand/20 border-brand/40 border '
            )}
          >
            {router.pathname === routes.admin.profile && (
              <div className="bg-brand absolute right-0 top-[calc(50%-10px)] h-[20px] w-1"></div>
            )}
            <Link
              href={`${routes.admin.profile}`}
              className="group cursor-pointer transition-all"
            >
              <div className="flex items-center rounded-lg">
                <div>
                  <UserCircle2Icon
                    className={cn(
                      'text-body mr-4 h-5 w-5 shadow-xl transition-transform group-hover:scale-110 group-hover:text-white',
                      router.pathname === routes.admin.profile && 'text-brand'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-body',
                    router.pathname === routes.admin.profile && 'text-brand'
                  )}
                >
                  Profile
                </span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
