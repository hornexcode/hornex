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
import { makeClientReqObj, makeClientResObj } from '@/lib/request/util';
import {
  nextAuthOptions,
  optionalNextAuthOptions,
} from '@/pages/api/auth/[...nextauth]';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

export type GameID = {
  id: string;
  nickname: string;
  game: string;
};

const { fetch: getTournament } = dataLoader<Tournament>('getTournament');
const { fetch: getGameIds } = dataLoader<GameID[]>('getGameIds');
const { fetch: getParticipantCheckInStatus } =
  dataLoader<ParticipantCheckedInStatus>('getParticipantCheckedInStatus');
const { fetch: getRegistrations } =
  dataLoader<Registration>('getRegistrations');

const { fetch: listTournamentParticipants } = dataLoader<Participant[]>(
  'listTournamentParticipants'
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

const Tournament: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  tournament,
  gameIds,
  registrations = [],
  participants,
  participantCheckedInStatus,
  isRegistered,
}: TournamentProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <TournamentContextProvider
        isRegistered={isRegistered}
        participants={participants}
        tournament={tournament}
      >
        <TournamentDetailsTemplate
          tournament={tournament}
          gameIds={gameIds}
          registrations={registrations}
          isRegistered={isRegistered}
          participantCheckedInStatus={participantCheckedInStatus}
        />
      </TournamentContextProvider>
    </Suspense>
  );
};

Tournament.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(
    ctx.req,
    ctx.res,
    optionalNextAuthOptions
  );

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/sign-in',
      },
    };
  }

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

  const { data: registrations, error: registrationError } =
    await getRegistrations({}, ctx.req);

  if (!registrations || registrationError) {
    console.log('error', registrationError);
  }

  const { data: participantCheckedInStatusData } =
    await getParticipantCheckInStatus(
      {
        tournamentId: ctx.query.id || '',
      },
      ctx.req
    );

  const { data: participants, error } = await listTournamentParticipants(
    {
      tournamentId: tournament.id,
    },
    ctx.req
  );

  const isRegistered = !!participants?.find(
    (participant) => participant.email === session.user?.email
  );

  return {
    props: {
      params: ctx.params,
      tournament,
      gameIds,
      registrations,
      participants,
      isRegistered: isRegistered,
      participantCheckedInStatus:
        participantCheckedInStatusData?.checked_in || false,
    },
  };
};

export default Tournament;
