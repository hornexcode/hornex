import {
  CurrencyDollarIcon,
  MapPinIcon,
  TrophyIcon,
  UsersIcon,
} from '@heroicons/react/20/solid';
import Image, { StaticImageData } from 'next/image';
import classnames from 'classnames';

import TournamentCardBadge from './tournament-card-badge';
import TournamentCardAttr from './tournament-card-attr';
import Button from '@/components/ui/button/button';
import { EmblemGoldIcon } from '@/components/ui/icons/emblem-gold-icon';
import { EmblemSilverIcon } from '@/components/ui/icons/emblem-silver-icon';

type TournamentCardInfoProps = {
  tournament: {
    thumbnail: StaticImageData;
  };
};

export const TournamentListItem = ({ tournament }: TournamentCardInfoProps) => {
  return (
    <div className="rounded-lg bg-light-dark shadow-card">
      {/* tournament card header */}
      <div className="p-4">
        <div className="bg-emblem-gold h-[150px] w-full">
          <Image
            src={tournament.thumbnail}
            className="h-full rounded-lg"
            alt="ranked emblem"
          />
        </div>
        {/* tournament card body */}
        <div className="mt-4 block space-y-6 divide-y divide-slate-800">
          <div className="block">
            <span className="text-[11px]">
              SEP 02 - Starting at 06:00 PM (-3)
            </span>
            <h4 className="text-sm font-extrabold text-white">
              LOL: Platinum Tournament 2023
            </h4>
            <div className="mt-4 block space-x-1.5">
              <TournamentCardBadge text="BRASIL" />
              <TournamentCardBadge text="PC" />
              <TournamentCardBadge text="5v5" />
            </div>
          </div>

          <div className="block pb-2 pt-4">
            <div className="flex flex-wrap space-x-4">
              <TournamentCardAttr
                size="small"
                icon={<UsersIcon className="h-4 w-4" />}
                value="16"
                attr="Teams"
              />
              <TournamentCardAttr
                size="small"
                icon={<TrophyIcon className="h-4 w-4" />}
                value="1500 BRL"
                attr="Prize Pool"
              />

              <TournamentCardAttr
                size="small"
                icon={<TrophyIcon className="h-4 w-4" />}
                value="Silver, Gold"
                attr="Elo"
              />
            </div>
            {/* <div className="block">
              <span className="text-[0.675rem]">Allowed Elos</span>
              <div className="flex space-x-3">
                <div className="block text-center">
                  <EmblemGoldIcon className="w-7" />
                  <div className="block text-[0.5rem]">
                    <p>Gold</p>
                    <p>I, II</p>
                  </div>
                </div>
                <div className="block text-center">
                  <EmblemSilverIcon className="w-7" />
                  <div className="block text-[0.5rem]">
                    <p>Silver</p>
                    <p>I, II, III</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* tournament card footer */}
      <div className="grid grid-cols-2 space-y-2 rounded-b-lg border-t border-slate-700 bg-slate-800 p-4">
        <div className="col-span-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <CurrencyDollarIcon className="mr-1 h-5 w-4 fill-slate-300" />
              <span
                data-tooltip="tooltip-prize"
                className="text-xs font-bold text-white"
              >
                120/1500 BRL
              </span>
              {/* <Tooltip id="tooltip-prize">Accumulated prize pool</Tooltip> */}
            </div>
            {/* phase status */}
            <div className="relative flex">
              <span className="absolute -left-3 top-1 h-2 w-2 rounded-full bg-green-400"></span>
              <span className="text-xs font-bold uppercase text-green-400">
                open
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="flex items-center">
            <div className="flex">
              <UsersIcon className="mr-1 h-5 w-4 fill-slate-300" />
              <span className="pr-4 text-xs font-bold text-white">4/16</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={classnames(
                  'h-2 rounded-full bg-green-400',
                  'w-[70%]'
                )}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center pr-2 text-left">
          <h4 className="font-extrabold uppercase leading-4 tracking-tighter text-white">
            Free Entry
          </h4>
          <span className="text-xs">Closes in 7 days</span>
        </div>
        <div>
          <Button
            className="w-full bg-gradient-to-r from-sky-400 to-sky-500 -tracking-wider"
            shape="rounded"
            size="small"
          >
            Registration
          </Button>
        </div>
      </div>
    </div>
  );
};
