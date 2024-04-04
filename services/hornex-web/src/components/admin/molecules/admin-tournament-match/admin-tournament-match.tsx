'use client';

import Button from '@/components/ui/atoms/button';
import { useAdminTournament } from '@/contexts';
import { getStatus, Match } from '@/lib/models/Match';
import { dataLoader } from '@/lib/request';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, PlusIcon, Swords } from 'lucide-react';
import { FC, useState } from 'react';
import { toast } from 'sonner';
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
  const [isLoading, setIsLoading] = useState(false);
  let [isExpand, setIsExpand] = useState(false);

  const { tournament } = useAdminTournament();

  const { mutate } = useSWRConfig();
  const onStartMatchHandler = async () => {
    setIsLoading(true);
    const { error } = await startMatch({
      matchId: match.id,
      tournamentId: tournament.id,
    });
    if (error) {
      toast(error.message);
      console.error(error);
    } else {
      mutate('v1/org/tournaments/[id]/matches');
      toast('Match started successfully');
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
      toast('Failed to end match');
      console.error(error);
    } else {
      mutate('v1/org/tournaments/[id]/matches');
      toast('Match ended successfully');
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
      toast('Failed to update match score');
      console.error(error);
    } else {
      mutate('v1/org/tournaments/[id]/matches');
      toast('Match score updated successfully');
    }
  };

  const renderMatchAction = () => {
    switch (match.status) {
      case 'not_started':
        return (
          <Button
            fullWidth
            className="uppercase"
            shape="rounded"
            onClick={onStartMatchHandler}
            color="danger"
            isLoading={isLoading}
          >
            Start Match
          </Button>
        );
      case 'underway':
        return (
          <Button
            onClick={onEndedMatchHandler}
            className="ml-auto"
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
    <div className="border-border bg-muted/40 relative mb-2 flex cursor-pointer flex-col overflow-hidden rounded border shadow-lg">
      <div
        className="relative grid grid-cols-12"
        onClick={() => setIsExpand(!isExpand)}
      >
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
          {match.riot_match_code}
        </div>
      </div>

      {/* Collapseable */}
      <AnimatePresence initial={false}>
        {isExpand && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="border-border z-40 border-t px-4 py-4 sm:px-8 sm:py-6">
              <div className="mb-4 flex items-center justify-center text-2xl font-medium">
                0 - 0
              </div>
              {renderMatchAction()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTournamentMatch;
