import Button from '@/components/ui/atoms/button/button';
import { LeagueOfLegendsLogo } from '@/components/ui/atoms/icons/league-of-legends-icon';
import { LolFlatIcon } from '@/components/ui/atoms/icons/lol-flat-icon';
import { AppLayout } from '@/layouts';
import { dataLoader as dataLoader } from '@/lib/api';
import { Game, GetAvailableGamesResponse } from '@/lib/models/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
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
          <div className="">
            <h2 className="text-title text-left text-xl font-bold leading-4 lg:text-xl">
              Available Games
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {games.length &&
              games.map((game: Game) => (
                <Link
                  key={game.id}
                  href={`/pc/${game.slug}/tournaments`}
                  className="group"
                >
                  <div className="shadow-card">
                    {/* header */}
                    <div className="bg-medium-dark highlight-white-5 flex items-center rounded-t p-4">
                      <LolFlatIcon className="text-title mr-4 h-10 w-10" />
                      <h4 className="text-title text-lg font-bold">
                        {game.name}
                      </h4>
                    </div>
                    <div className="h-[300px] w-full bg-[url('/images/jinks.jpg')] bg-cover bg-center bg-no-repeat"></div>
                    {/* bottom */}
                    <div className="bg-light-dark flex rounded-b p-4">
                      <Button fullWidth shape="rounded" size="small">
                        Play
                      </Button>
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
