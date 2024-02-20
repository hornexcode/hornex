import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import { LongArrowLeft } from '@/components/ui/atoms/icons/long-arrow-left';
import routes from '@/config/routes';
import { Bars2Icon, Cog6ToothIcon } from '@heroicons/react/20/solid';
import { DashboardIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import {
  Edit2Icon,
  FileBadge,
  Gamepad2Icon,
  Home,
  SwordsIcon,
  Users2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const Sidebar = ({ className }: { className?: string }) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        'bg-light-dark shadow-card fixed top-0 z-50 flex h-full w-[200px] flex-col border-r border-zinc-700 px-8 py-4',
        className
      )}
    >
      <div className="text-title mb-10 flex h-[20] w-[200px] items-center text-xl font-bold">
        <Link className="mr-4 block font-extrabold text-white" href="/">
          <Image className="w-7" src={HornexLogo} alt="Hornex logo" />
        </Link>
        HORNEX
      </div>
      <div className="mb-4 py-2">
        <Link
          href={`/admin/tournaments`}
          className="group cursor-pointer transition-all"
        >
          <div className="mb-2 flex items-center rounded-lg">
            <LongArrowLeft className="text-title mr-4 h-4 w-4 shadow-xl transition-transform group-hover:scale-110" />
            <span className="text-title text-sm font-bold">Back</span>
          </div>
        </Link>
      </div>
      <ul className="flex w-full flex-col space-y-2 text-xs">
        <li className="">
          <Link href={`/`} className="group cursor-pointer transition-all">
            <div className="mb-2 flex items-center rounded-lg">
              <div>
                <DashboardIcon className="text-body mr-4 h-4 w-4 shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-body text-sm">Dashbboard</span>
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
                <Gamepad2Icon className="text-body mr-4 h-4 w-4 shadow-xl transition-transform group-hover:scale-110" />
              </div>
              <span className="text-body text-sm">Games</span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};
