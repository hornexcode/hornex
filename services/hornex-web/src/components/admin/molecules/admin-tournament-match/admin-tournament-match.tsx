import Button from '@/components/ui/atoms/button';
import { toast } from '@/components/ui/use-toast';
import { useAdminTournament } from '@/contexts';
import { getStatus, Match } from '@/lib/models/Match';
import { dataLoader } from '@/lib/request';
import { cn } from '@/lib/utils';
import { Loader2, PlusIcon, Swords } from 'lucide-react';
import React, { FC } from 'react';
import { useSWRConfig } from 'swr';

const { submit: startMatch } = dataLoader<Match>('org:tournament:match:start');
const { submit: endMatch } = dataLoader<Match>('org:tournament:match:end');
const { submit: updateMatch } = dataLoader<Match, Partial<Match>>(
  'org:match:update'
);

export type AdminTournamentMatchProps = {
  match: Match;
};

const AdminTournamentMatch: FC<AdminTournamentMatchProps> = ({ match }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const { tournament } = useAdminTournament();

  const { mutate } = useSWRConfig();
  const onStartMatchHandler = async () => {
    setIsLoading(true);
    const { error } = await startMatch({
      matchId: match.id,
      tournamentId: tournament.id,
    });
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to start match',
      });
      console.error(error);
    } else {
      mutate('v1/org/tournaments/[id]/matches');
      toast({
        title: 'Success',
        description: 'Match successfully started!',
      });
    }
    setIsLoading(false);
  };

  const onEndedMatchHandler = async () => {
    setIsLoading(true);
    const { error } = await endMatch({
      matchId: match.id,
      tournamentId: tournament.id,
    });
    if (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to finish match',
      });
      console.error(error);
    } else {
      mutate('v1/org/tournaments/[id]/matches');
      toast({
        title: 'Success',
        description: 'Match successfully finished!',
      });
    }
    setIsLoading(false);
  };

  const onScoreUpdated = async (matchId: string, team: 'a' | 'b') => {
    const payload =
      team === 'a'
        ? { team_a_score: match.team_a_score + 1 }
        : { team_b_score: match.team_b_score + 1 };

    const { error } = await updateMatch(
      {
        id: matchId,
      },
      payload
    );
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update match score',
      });
      console.error(error);
    } else {
      mutate('v1/org/tournaments/[id]/matches');
      toast({
        title: 'Success',
        description: 'Match score successfully updated!',
      });
    }
  };

  const renderMatchAction = () => {
    if (isLoading) {
      return <Loader2 className="h-8 w-8 animate-spin" />;
    }

    switch (match.status) {
      case 'not_started':
        return (
          <Button
            onClick={onStartMatchHandler}
            className="ml-auto"
            shape="rounded"
            size="small"
            color="danger"
          >
            Start Match
          </Button>
        );
      case 'underway':
        return (
          <Button
            onClick={onEndedMatchHandler}
            className="ml-auto"
            shape="rounded"
            color="danger"
            size="small"
          >
            Complete
          </Button>
        );
      default:
        return <span className="text-title">Ended</span>;
    }
  };

  const renderTeamAScore = () => {
    if (match.status === 'not_started') {
      return <span className="text-muted">-</span>;
    }
    if (match.status === 'ended') {
      if (match.winner?.id === match.team_a.id) {
        return <span className="text-green-500">winner</span>;
      }
      return <span className="text-red-500">loser</span>;
    }
    return (
      <>
        {match.team_a_score}
        <Button
          onClick={() => onScoreUpdated(match.id, 'a')}
          size="mini"
          shape="rounded"
          className={cn('ml-4 !h-6 w-3')}
        >
          <PlusIcon className="text-dark h-4 w-4" />
        </Button>
      </>
    );
  };

  const renderTeamBScore = () => {
    if (match.status === 'not_started') {
      return <span className="text-muted">-</span>;
    }
    if (match.status === 'ended') {
      if (match.winner?.id === match.team_b.id) {
        return <span className="text-green-500">winner</span>;
      }
      return <span className="text-red-500">loser</span>;
    }
    return (
      <>
        {match.team_b_score}
        <Button
          onClick={() => onScoreUpdated(match.id, 'b')}
          size="mini"
          shape="rounded"
          className="ml-4 !h-6 w-3"
        >
          <PlusIcon className="text-dark h-4 w-4" />
        </Button>
      </>
    );
  };

  return (
    <div className="border-border mb-2 grid grid-cols-12 rounded border shadow-lg">
      <div className="border-border col-span-1 flex items-center justify-center border-r p-4">
        <Swords className="text-title h-8 w-8" />
      </div>
      <div className="border-border col-span-4 border-r">
        <div className="block items-start">
          <div className="border-border border-b">
            <div className="text-title p-2 px-4">{match.team_a.name}</div>
          </div>
          <div className="">
            <div className="text-title p-2 px-4">{match.team_b.name}</div>
          </div>
        </div>
      </div>
      <div className="border-border col-span-1 flex flex-col items-center border-r text-center">
        <div className="text-title border-border flex w-full items-center justify-center border-b p-2 font-medium">
          {renderTeamAScore()}
        </div>
        <div className="text-title flex w-full items-center justify-center p-2 font-medium">
          {renderTeamBScore()}
        </div>
      </div>
      <div className="border-border col-span-2 flex items-center justify-center text-center">
        <div className="text-title font-normal">Round {match.round}</div>
      </div>
      <div className="border-border col-span-2 flex items-center justify-center text-center">
        <div className="text-title font-normal">{getStatus(match)}</div>
      </div>
      <div className="col-span-2 flex items-center justify-center p-4">
        {renderMatchAction()}
      </div>
    </div>
  );
};

export default AdminTournamentMatch;
