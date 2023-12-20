import { LeagueOfLegendsLogo } from '@/components/ui/atoms/icons/league-of-legends-icon';
import routes from '@/config/routes';
import { AppLayout } from '@/layouts';
import { dataLoader as dataLoader } from '@/lib/api';
import { Game, GetAvailableGamesResponse } from '@/lib/hx-app/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

const { fetch: getAvailableGames } =
  dataLoader<GetAvailableGamesResponse>('getAvailableGames');

const CompetePage = ({
  games,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="mx-auto space-y-8 p-8">
      <section id="available-games">
        <div className="space-y-10">
          <div className="mb-4 border-b border-slate-800 pb-2">
            <h2 className="text-left text-xl font-bold leading-4 text-white lg:text-xl">
              Available Games
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.length &&
              games.map((game: Game) => (
                <Link
                  key={game.id}
                  href={`/pc/${game.slug}/tournaments`}
                  className="group"
                >
                  <div className="shadow-main relative h-[300px] w-full rounded-lg bg-[url('/images/jinks.jpg')] bg-cover bg-center bg-no-repeat">
                    <div className="absolute inset-0 rounded-md bg-sky-600/60"></div>
                    <div className="relative top-0 flex w-full  justify-center p-4">
                      <LeagueOfLegendsLogo className="fill-white" />
                    </div>
                    <div className="absolute bottom-0 mx-auto w-full rounded-b bg-sky-600/70 p-4 text-center">
                      <h4 className="text-xl font-bold text-white">Jogar</h4>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

CompetePage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { data: games } = await getAvailableGames({}, req);

  return {
    props: {
      games: games || [],
    },
  };
};

export default CompetePage;
