import Loading from './loading';
import TournamentDetailsTemplate from '@/components/ui/templates/tournament-details-template';
import { TournamentContextProvider } from '@/contexts/tournament';
import { AppLayout } from '@/layouts';
import {
  Participant,
  ParticipantCheckedInStatus,
  Registration,
  Tournament,
} from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Suspense } from 'react';

export type GameID = {
  id: string;
  nickname: string;
  game: string;
};

const { fetch: getTournament } = dataLoader<Tournament>('getTournament');
const { fetch: getGameIds } = dataLoader<GameID[]>('getGameIds');
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
  gameIds: GameID[];
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
}: TournamentProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <TournamentContextProvider
        isRegistered={isRegistered}
        tournament={tournament}
      >
        <TournamentDetailsTemplate
          participantCheckedInStatus={participantCheckedInStatus}
        />
      </TournamentContextProvider>
    </Suspense>
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

  const { data: registrations, error: registrationsError } =
    await getTournamentRegistrations(
      {
        id: tournament.id,
        game: ctx.query.game || '',
        platform: ctx.query.platform || '',
      },
      ctx.req
    );

  console.log(registrations);

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
