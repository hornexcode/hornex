import { TournamentFeedItemProps } from './tournament-feed-item.types';
import Button from '@/components/ui/atoms/button/button';
import { UsersIcon } from '@heroicons/react/20/solid';
import { DollarSign, SwordIcon, Swords } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';

const TournamentFeedItem: FC<TournamentFeedItemProps> = ({ tournament }) => {
  const router = useRouter();
  return (
    <div className="shadow-light bg-light-dark rounded">
      <div className="bg-medium-dark rounded-t">
        <div className="block px-5 py-4">
          <Link
            href="/nft-details"
            className="dark:text-title text-lg font-extrabold text-black"
          >
            {/* trim name */}
            {tournament.name.length >= 25
              ? tournament.name.substring(0, 20) + '...'
              : tournament.name}
          </Link>
          <div className="text-body mb-1">
            {moment(tournament.start_date).format('MMMM Do YYYY')}
          </div>
        </div>
      </div>

      <div className="block">
        <Image
          src={`/images/tournaments/${tournament.feature_image}`}
          width={1920}
          height={1080}
          alt="Cover Image"
        />
      </div>

      {/* League of Legends Metadata */}
      <div className="block px-5 pt-5">
        <div className="font-display text-xs font-medium uppercase text-white">
          Classification
        </div>
        <div className="text-xs text-gray-400">{tournament.classification}</div>
      </div>

      <div className="grid grid-cols-2 space-y-2 p-5">
        <div className="col-span-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <UsersIcon className="mr-1 h-5 w-4 " />
              <span className="font-display pr-4 text-xs font-bold text-white">
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
        {/* <div className="col-span-2">
          <div className={classnames('flex w-full')}>
            {Array.from({ length: tournament.max_teams }).map((_, index) => (
              <div
                key={index}
                className={classnames(
                  'flex-basis mr-1 h-2 flex-grow rounded-[2px] bg-gray-400',
                  {
                    '!bg-amber-500': index < tournament.teams.length,
                  }
                )}
              ></div>
            ))}
          </div>
        </div> */}
      </div>

      <div className="shadow-light flex items-end rounded-b-lg border-t border-dashed border-gray-600 px-5 py-4">
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
            shape="rounded"
            size="small"
            onClick={() =>
              router.push(
                `/${tournament.platform}/${tournament.game}/tournaments/${tournament.id}`
              )
            }
          >
            <div className="flex items-center">
              <span className="">Jogar</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TournamentFeedItem;
