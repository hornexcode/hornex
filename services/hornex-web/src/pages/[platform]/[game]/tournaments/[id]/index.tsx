import TournamentDetailsTemplate from '@/components/ui/templates/tournament-details-template';
import { AppLayout } from '@/layouts';
import {
  ParticipantCheckedInStatus,
  Registration,
  Tournament,
} from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

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

type TournamentProps = {
  params: {
    platform: string;
    game: string;
    id: string;
  };
  tournament: Tournament;
  gameIds: GameID[];
  registrations: Registration[];
  participantCheckedInStatus: boolean;
};

const Tournament: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  params,
  tournament,
  gameIds,
  registrations = [],
  participantCheckedInStatus,
}: TournamentProps) => {
  // TODO: add switch to render different types of tournament template
  // switch (params.game) {
  //   case LEAGUE_OF_LEGENDS:
  //     return <TournamentDetailsTemplate />;
  //   default:
  //     break;
  // }
  return (
    <TournamentDetailsTemplate
      registrations={registrations}
      tournament={tournament}
      gameIds={gameIds}
      participantCheckedInStatus={participantCheckedInStatus}
    />
  );
};

Tournament.getLayout = (page: React.ReactElement) => {
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

  const { data: registrations, error: registrationError } =
    await getRegistrations(
      {
        status: 'accepted',
      },
      ctx.req
    );

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

  return {
    props: {
      params: ctx.params,
      tournament,
      gameIds,
      registrations,
      participantCheckedInStatus:
        participantCheckedInStatusData?.checked_in || false,
    },
  };
};

export default Tournament;
