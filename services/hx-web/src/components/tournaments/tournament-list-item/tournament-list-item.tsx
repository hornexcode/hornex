import {
  CurrencyDollarIcon,
  MapPinIcon,
  TrophyIcon,
  UsersIcon,
} from '@heroicons/react/20/solid';
import classnames from 'classnames';
import Image, { StaticImageData } from 'next/image';

import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import Button from '@/components/ui/button/button';

import TournamentCardAttr from './tournament-card-attr';
import TournamentCardBadge from './tournament-card-badge';

type TournamentCardInfoProps = {
  tournament: {
    thumbnail: StaticImageData;
  };
};

export const TournamentListItem = ({ tournament }: TournamentCardInfoProps) => {
  return (
    <div className="rounded bg-light-dark shadow-card">
      {/* tournament card header */}
      <div className="flex items-start p-4">
        <div className="block">
          <Image className="w-28" src={HornexLogo} alt="thumbnail" />
        </div>
        <div className="block">
          <span className="text-[11px]">SEP 02 @ 06:00 PM (-3)</span>
          <h4 className="text-sm font-extrabold tracking-wide text-white">
            LOL: Platinum Tournament 2023
          </h4>
          <div className="mt-4 block space-x-1.5">
            <TournamentCardBadge text="BRASIL" />
            <TournamentCardBadge text="PC" />
            <TournamentCardBadge text="5v5" />
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="block border-t border-t-slate-800 py-4">
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
        </div>
      </div>

      <div className="px-4">
        <div className="grid grid-cols-2 space-y-2 border-t border-t-slate-800 py-4">
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
        </div>
      </div>

      {/* tournament card footer */}
      <div className="grid grid-cols-2 rounded-b-lg border-t border-slate-700 bg-slate-800 p-4">
        <div className="flex flex-col justify-center pr-2 text-left">
          <h4 className="font-extrabold uppercase leading-4 text-white">
            Free Entry
          </h4>
          <span className="text-xs">Closes in 7 days</span>
        </div>
        <div>
          <Button
            color="secondary"
            className="font-semibold"
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
