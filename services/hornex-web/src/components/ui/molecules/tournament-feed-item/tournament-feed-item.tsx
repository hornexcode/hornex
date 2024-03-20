'use client';

import TournamentRegistrationStateProgress from '../tournament-registration-state-progress';
import { TournamentFeedItemProps } from './tournament-feed-item.types';
import Button from '@/components/ui/atoms/button/button';
import { cn } from '@/lib/utils';
import { MapPinIcon } from '@heroicons/react/20/solid';
import { ClockIcon } from '@radix-ui/react-icons';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const TournamentFeedItem: FC<TournamentFeedItemProps> = ({
  tournament,
  className,
}) => {
  const router = useRouter();

  return (
    <div className={cn('border-border rounded border', className)}>
      <div className="h-[160px] w-full bg-[url('/images/tournaments/tmt-8.png')] bg-cover bg-no-repeat"></div>

      <div className="block px-5 pt-4">
        <Link
          href="/nft-details"
          className="dark:text-title text-lg font-extrabold text-black"
        >
          {/* trim name */}
          {tournament.name.length >= 25
            ? tournament.name.substring(0, 20) + '...'
            : tournament.name}
        </Link>
      </div>

      <div className="border-border text-body flex items-center border-b px-4 pb-4">
        <div className="border-border flex items-center border-r pr-4">
          <MapPinIcon className="mr-1 h-5 w-4" />
          <div className="font-medium">Brazil</div>
        </div>
        <div className="flex items-center px-4">
          <div className="font-medium">All Ranks</div>
        </div>
      </div>

      <div className="border-border flex items-center border-b p-4">
        <ClockIcon className="mr-2 h-5 w-4 text-white" />
        <div className="font-medium text-white">
          {moment(tournament.start_date).format('MMMM Do, h:mm a')}
        </div>
      </div>

      <TournamentRegistrationStateProgress
        className="p-5"
        tournament={tournament}
      />

      <div className="border-border flex items-center rounded-b-lg border-t px-5 py-4">
        <div>
          {tournament.is_entry_free ? (
            <span className="text-title font-bold uppercase">Entry free</span>
          ) : (
            <span className="text-title font-medium">
              {tournament.entry_fee} {tournament.currency}
            </span>
          )}
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
              {tournament.status !== 'ended' ? 'Join now' : 'See results'}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TournamentFeedItem;
