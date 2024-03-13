import Baron from '@/assets/images/games/league-of-legends/baron.jpg';
import SummonersRiftMap from '@/assets/images/games/league-of-legends/summoners-rift-map.png';
import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import { LeagueOfLegendsLogo } from '@/components/ui/atoms/icons/league-of-legends-icon';
import { LolFlatIcon } from '@/components/ui/atoms/icons/lol-flat-icon';
import TournamentsFeedTemplate from '@/components/ui/templates/tournaments-feed-template/tournaments-feed-template';
import { AppLayout } from '@/layouts';
import { GetTournamentsResponse } from '@/lib/models/types/rest/get-tournaments';
import { dataLoader as dataLoader } from '@/lib/request';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const { fetch: getTournaments } =
  dataLoader<GetTournamentsResponse>('getTournaments');

type CompetePageProps = {
  game: string;
  platform: string;
  tournaments: GetTournamentsResponse;
};

export const getServerSideProps = (async ({
  query: { game, platform },
  req,
}) => {
  if (typeof game !== 'string' || typeof platform !== 'string') {
    game = 'league-of-legends';
    platform = 'pc';
  }

  const { data: tournaments, error } = await getTournaments(
    { game, platform },
    req
  );

  if (error || !tournaments) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      game,
      platform,
      tournaments,
    },
  };
}) satisfies GetServerSideProps<CompetePageProps>;

const CompetePage = ({
  tournaments,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="px-8">
      <section id="available-games">
        <TournamentsFeedTemplate data={tournaments} />
      </section>
    </div>
  );
};

CompetePage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default CompetePage;
