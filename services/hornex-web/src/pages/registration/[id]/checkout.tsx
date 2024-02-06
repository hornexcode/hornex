import TournamentCheckoutTemplate from '@/components/ui/templates/tournament-checkout-template';
import { AppLayout } from '@/layouts';
import { Registration, Team, Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import getStripe from '@/utils/get-stripejs';
import { Elements } from '@stripe/react-stripe-js';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const { fetch: getTournament } = dataLoader<Tournament>('getTournament');
const { fetch: getTeam } = dataLoader<Team>('getTeam');
const { fetch: getRegistration } = dataLoader<Registration>('getRegistration');

type RegistrationCheckoutProps = {
  params: {
    platform: string;
    game: string;
    id: string;
  };
  tournament: Tournament;
  team: Team;
};

const RegistrationCheckout: InferGetServerSidePropsType<
  typeof getServerSideProps
> = ({ params, tournament, team }: RegistrationCheckoutProps) => {
  return (
    <Elements stripe={getStripe()}>
      <TournamentCheckoutTemplate team={team} tournament={tournament} />
    </Elements>
  );
};

RegistrationCheckout.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // check user is authenticated
  console.log(ctx.query.id);
  const { data: registration, error: registrationError } =
    await getRegistration(
      {
        id: ctx.query.id || '',
      },
      ctx.req
    );

  console.log(registration);

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

export default RegistrationCheckout;
