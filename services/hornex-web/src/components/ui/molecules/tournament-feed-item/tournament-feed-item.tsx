import { TournamentFeedItemProps } from './tournament-feed-item.types';
import Button from '@/components/ui/atoms/button/button';
import { getStatus } from '@/lib/models';
import { UsersIcon } from '@heroicons/react/20/solid';
import { ClockIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';

const TournamentFeedItem: FC<TournamentFeedItemProps> = ({
  tournament,
  className,
}) => {
  const router = useRouter();
  return (
    <div
      className={clsx(
        'shadow-card bg-light-dark max-w-[230px] rounded',
        className
      )}
    >
      <div className="bg-dark rounded-t">
        <div className="block px-5 py-4">
          <Link
            href="/nft-details"
            className="dark:text-title font-roboto-condensed text-lg font-extrabold text-black"
          >
            {/* trim name */}
            {tournament.name.length >= 25
              ? tournament.name.substring(0, 20) + '...'
              : tournament.name}
          </Link>
        </div>
      </div>

      <div className="block">
        <Image
          src={`/images/tournaments/tmt-7.jpeg`}
          width={1920}
          height={1080}
          alt="Cover Image"
        />
      </div>

      <div className="border-background flex items-center border-b p-4">
        <ClockIcon className="text-title mr-1 h-5 w-4" />
        <div className="text-title">
          {moment(tournament.start_date).format('MMMM Do, h:mm a')}
        </div>
      </div>

      <div className="grid grid-cols-2 space-y-2 p-5">
        <div className="col-span-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <UsersIcon className="text-muted mr-1 h-5 w-4" />
              <span className="font-display text-muted pr-4 text-xs font-extrabold">
                {tournament.registered_teams.length}/{tournament.max_teams}
              </span>
            </div>
            {/* phase status */}
            <div className="relative flex">
              <span className="absolute -left-3 top-1 h-2 w-2 rounded-full bg-green-400"></span>
              <span className="font-source-sans text-xs font-bold uppercase text-green-400">
                {getStatus(tournament)}
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className={clsx('flex w-full')}>
            {/* build a progress bar */}
            <div className="bg-background flex w-full rounded-lg">
              <div
                style={{
                  width: `${
                    (tournament.registered_teams.length /
                      tournament.max_teams) *
                    100
                  }%`,
                }}
                className="h-2 rounded-lg bg-amber-400"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-background flex items-end rounded-b-lg border-t px-5 py-4">
        <div className="ml-auto text-right">
          <Button
            shape="rounded"
            size="small"
            onClick={() =>
              router.push(
                `/${tournament.platform}/${tournament.game}/tournaments/${tournament.uuid}`
              )
            }
          >
            <div className="flex items-center">
              <span className="">Play</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TournamentFeedItem;
