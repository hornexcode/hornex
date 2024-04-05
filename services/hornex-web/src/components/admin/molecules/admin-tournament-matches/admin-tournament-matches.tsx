import AdminTournamentMatch from '@/components/admin/molecules/admin-tournament-match/admin-tournament-match';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAdminTournament } from '@/contexts/admin-tournament';
import { Match } from '@/lib/models/Match';
import { isLastRound, TournamentStatusOptions } from '@/lib/models/Tournament';
import { dataLoader } from '@/lib/request';
import { cn } from '@/lib/utils';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { AlertCircle } from 'lucide-react';
import React, { FC, useState } from 'react';
import { useSWRConfig } from 'swr';

const { useData: useGetTournamentMatchesQuery } = dataLoader<Match[]>(
  'org:tournament:matches'
);
const { submit: endRound } = dataLoader('org:tournament:endRound');

type AdminTournamentMatchesProps = {};
const AdminTournamentMatches: FC<AdminTournamentMatchesProps> = ({}) => {
  const { tournament, refreshTournament } = useAdminTournament();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const { data: matches, error } = useGetTournamentMatchesQuery({
    id: tournament.id,
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
    const { error } = await endRound({ id: tournament.id });
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
    mutate('v1/org/tournaments/[id]/matches');
    refreshTournament(tournament);
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full">
        <div className="mb-4 ml-auto flex items-center justify-between">
          <span className="text-title mr-4 font-normal">
            Round: {tournament.current_round}
          </span>
          {!isLastRound(tournament) && (
            <Button
              onClick={onEndRoundHandler}
              className=""
              disabled={isLoading}
              variant={'secondary'}
            >
              <div className="flex">
                <span className="">End Round</span>
              </div>
            </Button>
          )}
        </div>
      </div>

      <div className={cn('hidden', isLastRound(tournament) && 'mb-10 block')}>
        <Alert className="border-border bg-muted/40">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Last Round!</AlertTitle>
          <AlertDescription className="text-md">
            After completing this match, go to General info to complete the
            tournament.
          </AlertDescription>
        </Alert>
      </div>

      <div>
        {matches &&
          matches.map((match) => (
            <AdminTournamentMatch key={match.id} match={match} />
          ))}
      </div>
    </div>
  );
};

export default AdminTournamentMatches;
