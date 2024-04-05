'use client';

import Button from '@/components/ui/atoms/button';
import { useAdminTournament } from '@/contexts';
import { getStatus, Match } from '@/lib/models/Match';
import { dataLoader } from '@/lib/request';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Loader2, MenuIcon, PlusIcon, Swords } from 'lucide-react';
import { FC, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
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

  const [copyButtonStatus, setCopyButtonStatus] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();
  function handleCopyToClipboard() {
    copyToClipboard(match?.riot_match_code || '');
    setCopyButtonStatus(true);
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 2500);
  }

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
            className="ml-auto uppercase"
            shape="rounded"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            END MATCH
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
        return <span className="text-green-500">{match.team_a.name}</span>;
      }
      return <span className="text-red-500">{match.team_a.name}</span>;
    }
    return (
      <>
        <div className="mr-4">{match.team_a.name}</div>
        <Button
          onClick={() => onScoreUpdated(match.id, 'a')}
          size="mini"
          shape="rounded"
          className={cn('mr-4 !h-6 w-3')}
        >
          <PlusIcon className="text-dark h-4 w-4" />
        </Button>
        {match.team_a_score}
      </>
    );
  };

  const renderTeamBScore = () => {
    if (match.status === 'not_started') {
      return <span className="text-muted">-</span>;
    }
    if (match.status === 'ended') {
      if (match.winner?.id === match.team_b.id) {
        return <span className="text-green-500">{match.team_b.name}</span>;
      }
      return <span className="text-red-500">{match.team_b.name}</span>;
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
        <div className="ml-4">{match.team_b.name}</div>
      </>
    );
  };

  const winner = match.winner?.id === match.team_a.id ? 'team_a' : 'team_b';
  const hasWinner = match.status === 'ended' && match.winner;
  console.log(winner);

  return (
    <div className="border-border bg-muted/40 relative mb-2 flex flex-col overflow-hidden rounded border shadow-lg">
      <div className="relative grid grid-cols-12">
        <div className="border-border col-span-1 flex items-center justify-center border-r p-4">
          <Swords className="text-title h-8 w-8" />
        </div>
        <div className="border-border col-span-4 border-r">
          <div className="block items-start">
            <div className="border-border border-b">
              <div
                className={cn(
                  'text-title p-2 px-4',
                  hasWinner && winner === 'team_a'
                    ? 'font-bold text-green-500'
                    : ''
                )}
              >
                {match.team_a.name}{' '}
                {hasWinner && winner === 'team_a' && '(Winner)'}
              </div>
            </div>
            <div className="">
              <div
                className={cn(
                  'text-title p-2 px-4',
                  hasWinner && winner === 'team_b'
                    ? 'font-bold text-green-500'
                    : ''
                )}
              >
                {match.team_b.name}{' '}
                {hasWinner && winner === 'team_b' && '(Winner)'}
              </div>
            </div>
          </div>
        </div>
        <div className="border-border col-span-2 flex items-center justify-center text-center">
          <div className="text-title font-normal">{getStatus(match)}</div>
        </div>
        <div className="col-span-3 flex items-center justify-center p-4">
          {match.riot_match_code}
        </div>
        <div
          title="Copy Address"
          className="flex cursor-pointer items-center px-4 text-gray-500 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          onClick={() => handleCopyToClipboard()}
        >
          {copyButtonStatus ? (
            <Check className="h-auto w-3.5 text-green-500" />
          ) : (
            <Copy className="h-auto w-3.5" />
          )}
        </div>

        <div
          className="col-span-1 flex cursor-pointer items-center justify-center"
          onClick={() => setIsExpand(!isExpand)}
        >
          <MenuIcon className="hover:text-brand h-6 w-6" />
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
                {renderTeamAScore()} - {renderTeamBScore()}
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
