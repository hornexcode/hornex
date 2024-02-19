import { TournamentTableRowProps } from './tournament-table-row.types';
import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import { getStatus } from '@/lib/models';
import clsx from 'clsx';
import { Edit, UsersIcon } from 'lucide-react';
import Image from 'next/image';
import React, { FC } from 'react';

const TournamentTableRow: FC<TournamentTableRowProps> = ({ tournament }) => {
  return (
    <div className="flex">
      <div className="border-accent bg-medium-dark flex w-full items-center rounded border p-4 shadow-sm">
        {/* image */}
        <div className="flex w-12 items-center">
          <Image className="w-7" src={HornexLogo} alt="Hornex logo" />
        </div>
        {/* name */}
        <div className="block lg:w-[200px]">
          <div className="text-title text-sm">{tournament.name}</div>
          <div className="text-body text-xs">{tournament.game}</div>
        </div>
        {/* status */}
        <div className="block lg:w-[200px]">
          <div className="grid grid-cols-2 space-y-2">
            <div className="col-span-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <UsersIcon className="text-body mr-1 h-5 w-4" />
                  <span className="font-display text-body pr-4 text-xs font-bold">
                    20/32
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
                      width: `${(20 / 32) * 100}%`,
                    }}
                    className="h-2 rounded-lg bg-amber-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hover:text-title ml-auto cursor-pointer">
          <div data-cy="edit">
            <Edit className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentTableRow;
