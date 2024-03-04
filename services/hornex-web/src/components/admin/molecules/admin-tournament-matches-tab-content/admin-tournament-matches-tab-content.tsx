import { AdminTournamentMatchesTabContentProps } from './admin-tournament-matches-tab-content.types';
import AdminTournamentMatch from '@/components/admin/molecules/admin-tournament-match/admin-tournament-match';
import Button from '@/components/ui/atoms/button';
import { toast } from '@/components/ui/use-toast';
import { useAdminTournament } from '@/contexts/admin-tournament';
import { getRounds, Match, TournamentStatusOptions } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import React, { FC, useState } from 'react';
import { useSWRConfig } from 'swr';

const { useData: useGetTournamentMatchesQuery } = dataLoader<Match[]>(
  'org:tournament:matches'
);
const { submit: endRound } = dataLoader('org:tournament:endRound');

const AdminTournamentMatchesTabContent: FC<
  AdminTournamentMatchesTabContentProps
> = ({}) => {
  const { tournament } = useAdminTournament();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const { data: matches, error } = useGetTournamentMatchesQuery({
    uuid: tournament.uuid,
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (tournament.status != TournamentStatusOptions.RUNNING) {
    return (
      <div className="text-muted mt-4 flex items-center font-normal">
        <ExclamationCircleIcon className="text-warning mr-2 w-4" />
        <p className="">Matches are only available for running tournaments</p>
      </div>
    );
  }

  const onEndRoundHandler = async () => {
    setIsLoading(true);
    const { error } = await endRound({ uuid: tournament.uuid });
    setIsLoading(false);
    if (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to end round',
      });
      return;
    }
    toast({
      title: 'Success',
      description: 'Round ended successfully!',
    });
    mutate('v1/org/tournaments/[uuid]/matches');
  };

  if (true) {
    return (
      <div className="bg-medium-dark p-6">
        <h4 className="text-title text-lg">End Tournament</h4>
        <p className="font-normal">
          Review the results and complete the tournament
        </p>
        <Button
          onClick={onEndRoundHandler}
          shape="rounded"
          size="small"
          className="mt-6"
          color="danger"
          disabled={isLoading}
        >
          <div className="flex">
            <span className="">Complete</span>
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex w-full">
        <div className="mb-4 ml-auto flex items-center">
          <span className="text-title mr-4 text-xl font-normal">
            Round: {tournament.current_round}
          </span>
          <Button
            onClick={onEndRoundHandler}
            shape="rounded"
            size="small"
            className=""
            disabled={isLoading}
          >
            <div className="flex">
              <span className="">End Round</span>
            </div>
          </Button>
        </div>
      </div>
      {matches &&
        matches.map((match) => (
          <AdminTournamentMatch key={match.id} match={match} />
        ))}
    </div>
  );
};

export default AdminTournamentMatchesTabContent;
