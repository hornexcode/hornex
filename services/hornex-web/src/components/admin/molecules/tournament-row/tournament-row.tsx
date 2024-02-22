import { TournamentTableRowProps } from './tournament-row.types';
import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import Button from '@/components/ui/atoms/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { getStatus, getStatus } from '@/lib/models';
import { Cog8ToothIcon } from '@heroicons/react/20/solid';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { UsersIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';

const TournamentTableRow: FC<TournamentTableRowProps> = ({ tournament }) => {
  return (
    <div className="flex">
      <div className="border-accent bg-medium-dark flex w-full items-center rounded border p-4 shadow-sm">
        {/* image */}
        <div className="flex w-9 items-center">
          <Image className="mx-auto w-7" src={HornexLogo} alt="Hornex logo" />
        </div>
        {/* name */}
        <div className="block px-4 lg:w-[400px]">
          <Link
            href={`/admin/${tournament.platform}/${tournament.game}/tournaments/${tournament.id}`}
            className="text-title hover:underline"
          >
            {tournament.name}
          </Link>
          <div className="text-body text-sm">{getGame(tournament)}</div>
        </div>
        {/* status */}
        <div className="block px-4 lg:w-[200px]">
          <div className="grid grid-cols-2 space-y-2">
            <div className="col-span-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <UsersIcon className="text-body mr-1 h-5 w-4" />
                  <span className="font-display text-body pr-4 text-xs font-bold">
                    {tournament.teams.length}/{tournament.max_teams}
                  </span>
                </div>
                {/* phase status */}
                <div className="relative flex">
                  <span className="absolute -left-3 top-1 h-2 w-2 rounded-full bg-green-400"></span>
                  <span className="text-xs font-bold uppercase text-green-400">
                    {getStatus(tournament)}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className={clsx('flex w-full')}>
                {/* build a progress bar */}
                <div className="bg-dark flex w-full rounded-lg">
                  <div
                    style={{
                      width: `${
                        (tournament.teams.length / tournament.max_teams) * 100
                      }%`,
                    }}
                    className="h-2 rounded-lg bg-amber-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Dates */}
        <div className="flex px-4">
          <div className="block">
            <div className="text-body text-xs">Start Date</div>
            <div className="text-title text-sm">
              {tournament.start_date} {tournament.start_time}
              {new Date().getTimezoneOffset() / -60}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentTableRow;
