import Baron from '@/assets/images/games/league-of-legends/baron.jpg';
import SummonersRiftMap from '@/assets/images/games/league-of-legends/summoners-rift-map.png';
import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import TournamentsFeedTemplate from '@/components/ui/templates/tournaments-feed-template/tournaments-feed-template';
import { AppLayout } from '@/layouts';
import { Tournament } from '@/lib/models';
import { GetTournamentsResponse } from '@/lib/models/types/rest/get-tournaments';
import { dataLoader as dataLoader } from '@/lib/request';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';

const { useData: getTournaments } =
  dataLoader<GetTournamentsResponse[]>('getTournaments');

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

  return (
    <div className="">
      <div className="relative h-[400px] w-full bg-[url('/images/league-of-legends/baron.jpg')] bg-auto">
        <div className="absolute left-0 top-0 h-full w-full backdrop-blur-lg"></div>
        <div className="bg-medium-dark/60 absolute left-0 top-0 h-full w-full"></div>
        <div className="absolute left-0 top-10 flex h-[400px] items-center justify-center p-10">
          <div className="col-span-1 flex h-full w-1/2 flex-1 flex-col justify-center p-4">
            <Image src={HornexLogo} className="w-[64px]" alt="hornex" />
            <h1 className="font-title text-6xl tracking-tight text-white">
              First season
            </h1>
            <p className="text-title font-source-sans text-2xl font-normal">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Quibusdam, labore.
            </p>
          </div>
          <div className="p-10">
            <Image
              className="h-full w-full"
              src={SummonersRiftMap}
              alt="baron"
            />
          </div>
        </div>
      </div>
      <section id="available-games">
        <div className="space-y-10">
          <TournamentsFeedTemplate isLoading={isLoading} tournaments={data} />
        </div>
      </section>
    </div>
  );
};

CompetePage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default CompetePage;
