import { TournamentCardInfoProps } from './tournament-card-info.types';
import Button from '@/components/ui/button/button';
import { UsersIcon } from '@heroicons/react/20/solid';
import classnames from 'classnames';
import { DollarSign } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import { FC } from 'react';

const TournamentCardInfo: FC<TournamentCardInfoProps> = ({ tournament }) => {
  return (
    <div className="shadow-light bg-light-dark rounded-md p-5">
      <div className="block">
        <div>
          {moment(tournament.start_time).format('MMMM Do YYYY, h:mm:ss a')}
        </div>
        <Link
          href="/nft-details"
          className="text-sm font-medium text-black dark:text-white"
        >
          {tournament.name}
        </Link>
      </div>

      {/* League of Legends Metadata */}
      <div className="mt-4 block">
        <div>Classification</div>
        <div className="text-sm font-semibold text-slate-200">
          {tournament.tier.toLocaleLowerCase()}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 space-y-2">
        <div className="col-span-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <UsersIcon className="mr-1 h-5 w-4 " />
              <span className="pr-4 text-xs font-bold text-white">
                {tournament.teams.length}/{tournament.max_teams}
              </span>
            </div>
            {/* phase status */}
            <div className="relative flex">
              <span className="absolute -left-3 top-1 h-2 w-2 rounded-full bg-white"></span>
              <span className="text-xs font-bold uppercase text-white">
                open
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={classnames(
                'h-1.5 rounded-full bg-white',
                `w-[${(
                  (tournament.teams.length / tournament.max_teams) *
                  100
                ).toFixed(2)}%]`
              )}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-end rounded-b-lg border-t border-slate-700 pt-5">
        <div className="block">
          <span className="text-xs text-slate-400">Prize Pool</span>
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4 text-white" />
            <span className="text-lg text-white">
              {tournament.entry_fee *
                tournament.max_teams *
                tournament.team_size}
            </span>
          </div>
        </div>
        <div className="ml-auto text-right">
          <Button
            color="secondary"
            className="font-semibold"
            size="mini"
            shape="rounded"
          >
            Registration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TournamentCardInfo;
