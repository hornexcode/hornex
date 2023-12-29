import TournamentCheckoutTemplate from '@/components/ui/templates/tournament-checkout-template';
import { AppLayout } from '@/layouts';
import { dataLoader } from '@/lib/api';
import { Registration, Team, Tournament } from '@/lib/models';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const { fetch: getTournament } = dataLoader<Tournament>('getTournament');
const { fetch: getTeam } = dataLoader<Team>('getTeam');
const { fetch: getRegistration } = dataLoader<Registration>('getRegistration');

type TournamentRegistrationCheckoutPageProps = {
  params: {
    platform: string;
    game: string;
    id: string;
  };
  tournament: Tournament;
  team: Team;
};

const Tournament: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  params,
  tournament,
  team,
}: TournamentRegistrationCheckoutPageProps) => {
  return <TournamentCheckoutTemplate team={team} tournament={tournament} />;
};

Tournament.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // check user is authenticated
  const { data: registration, error: registrationError } =
    await getRegistration(
      {
        id: ctx.query.id || '',
      },
      ctx.req
    );

  if (!registration || registrationError) {
    return {
      notFound: true,
    };
  }

  const { data: tournament, error: tournamentError } = await getTournament(
    {
      platform: registration.platform_slug,
      game: registration.game_slug,
      tournamentId: registration.tournament,
    },
    ctx.req
  );

  if (!tournament || tournamentError) {
    return {
      notFound: true,
    };
  }

  const { data: team, error: teamError } = await getTeam(
    {
      teamId: registration?.team,
    },
    ctx.req
  );

  return {
    props: {
      params: ctx.params,
      tournament,
      team,
    },
  };
};

export default Tournament;
