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
import Image from 'next/image';

const { useData: getTournaments } =
  dataLoader<GetTournamentsResponse>('getTournaments');

type TournamentsProps = {
  game: string;
  platform: string;
};

export const getServerSideProps = (async ({ query: { game, platform } }) => {
  if (typeof game !== 'string' || typeof platform !== 'string') {
    game = 'league-of-legends';
    platform = 'pc';
  }

  return {
    props: {
      pageProps: {
        game,
        platform,
      },
    },
  };
}) satisfies GetServerSideProps<{
  pageProps: TournamentsProps;
}>;

const CompetePage = ({
  pageProps: { game, platform },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, error, isLoading } = getTournaments({ game, platform });
  if (!data) return null;

  return (
    <div className="container mx-auto pt-16">
      <div className="relative h-[300px] w-full overflow-hidden bg-[url('/images/league-of-legends/baron.jpg')] bg-cover">
        <div className="bg-dark/50 absolute top-0 h-full w-full"></div>
        <div className="absolute top-0 h-full w-full bg-gradient-to-t from-black"></div>
        <div className="absolute left-10 top-20 flex h-[300px]">
          <div className="grid grid-cols-3 items-center justify-center">
            <div className="col-span-2 p-4">
              <LeagueOfLegendsLogo className="relative w-20 text-white" />
              <div className="flex items-center">
                <h1 className="font-beaufort text-6xl font-bold tracking-tight text-white">
                  Tournaments
                </h1>
              </div>
            </div>
            {/* <div className="col-span-2">
              <Image
                className="responsive-img h-full w-full"
                src={Baron}
                alt="baron"
              />
            </div> */}
          </div>
        </div>
      </div>
      <section id="available-games">
        <TournamentsFeedTemplate isLoading={isLoading} data={data} />
      </section>
    </div>
  );
};

CompetePage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default CompetePage;
