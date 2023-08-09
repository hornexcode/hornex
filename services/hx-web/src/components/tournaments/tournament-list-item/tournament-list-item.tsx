import {
  CurrencyDollarIcon,
  MapPinIcon,
  TrophyIcon,
  UsersIcon,
} from '@heroicons/react/20/solid';
import classnames from 'classnames';
import Image, { StaticImageData } from 'next/image';

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
      <div className="flex items-start p-6">
        <div className="block pr-4">
          <Image className="w-24" src={tournament.thumbnail} alt="thumbnail" />
        </div>
        <div className="block">
          <span className="text-xs">SEP 02 @ 06:00 PM (-3)</span>
          <h4 className="text-lg font-semibold leading-5 text-white">
            LOL: Platinum Tournament 2023
          </h4>
          <div className="mt-4 block space-x-1.5">
            <TournamentCardBadge text="BRASIL" />
            <TournamentCardBadge text="PC" />
            <TournamentCardBadge text="5v5" />
          </div>
        </div>
      </div>

      <div className="border-t border-t-slate-800 px-6">
        <div className="block  py-4">
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
              value="320"
              attr="Prize Pool"
            />

            <TournamentCardAttr
              size="small"
              icon={<UsersIcon className="h-4 w-4" />}
              value="Silver, Gold"
              attr="Elo"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-t-slate-800 px-6 py-4">
        <div className="grid grid-cols-2 space-y-2 ">
          <div className="col-span-2">
            <div className="flex justify-between">
              <div className="flex">
                <UsersIcon className="mr-1 h-5 w-4 fill-slate-300" />
                <span className="pr-4 text-xs font-bold text-white">4/16</span>
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
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={classnames(
                  'h-1.5 rounded-full bg-green-400',
                  'w-[70%]'
                )}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* tournament card footer */}
      <div className="flex items-center rounded-b-lg border-t border-slate-700 bg-slate-800 px-6 py-4">
        <div className="mx-auto block text-center">
          {/* <span className="text-xs text-slate-400">Prize Pool</span> */}
          <div className="flex items-center space-x-1">
            <TrophyIcon className="h-4 w-4" />
            <span className="text-lg font-semibold text-white">320,00</span>
          </div>
        </div>
        <div className="ml-auto text-right">
          <Button
            color="secondary"
            className="font-semibold"
            size="small"
            shape="rounded"
          >
            Registration
          </Button>
        </div>
      </div>
    </div>
  );
};
