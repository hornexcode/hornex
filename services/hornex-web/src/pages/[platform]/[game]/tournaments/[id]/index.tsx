import TournamentDetailsTemplate from '@/components/ui/templates/tournament-details-template';
import { GameIDContextProvider } from '@/contexts/gameid';
import { TournamentContextProvider } from '@/contexts/tournament';
import { AppLayout } from '@/layouts';
import { Participant, Registration } from '@/lib/models';
import { GameId } from '@/lib/models/Account';
import { Tournament } from '@/lib/models/Tournament';
import { dataLoader } from '@/lib/request';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React from 'react';

const { fetch: getTournament } = dataLoader<Tournament>('getTournament');
const { fetch: getGameIds } = dataLoader<GameId[]>('getGameIds');
const { fetch: getTournamentRegistrations } = dataLoader<Registration[]>(
  'getTournamentRegistrations'
);

type TournamentProps = {
  params: {
    platform: string;
    game: string;
    id: string;
  };
  tournament: Tournament;
  participants: Participant[];
  gameIds: GameId[];
  registrations: Registration[];
  participantCheckedInStatus: boolean;
  isRegistered: boolean;
};

const TournamentPage: InferGetServerSidePropsType<
  typeof getServerSideProps
> = ({
  tournament,
  participantCheckedInStatus,
  isRegistered,
  gameIds,
}: TournamentProps) => {
  return (
    <TournamentContextProvider
      isRegistered={isRegistered}
      tournament={tournament}
    >
      <GameIDContextProvider gameIds={gameIds}>
        <TournamentDetailsTemplate
          participantCheckedInStatus={participantCheckedInStatus}
        />
      </GameIDContextProvider>
    </TournamentContextProvider>
  );
};

TournamentPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data: tournament, error: tournamentError } = await getTournament(
    {
      tournamentId: ctx.query.id || '',
      platform: ctx.query.platform || '',
      game: ctx.query.game || '',
    },
    ctx.req
  );

  if (!tournament || tournamentError) {
    return {
      notFound: true,
    };
  }

  const { data: gameIds, error: gameIdsError } = await getGameIds({}, ctx.req);
  if (!gameIds || gameIdsError) {
    return {
      props: {
        params: ctx.params,
        tournament,
        gameIds: [],
      },
    };
  }

  const { data: registrations } = await getTournamentRegistrations(
    {
      id: tournament.id,
      game: ctx.query.game || '',
      platform: ctx.query.platform || '',
    },
    ctx.req
  );

  return {
    props: {
      params: ctx.params,
      tournament,
      gameIds,
      isRegistered: !!registrations?.length,
    },
  };
};

export default TournamentPage;
