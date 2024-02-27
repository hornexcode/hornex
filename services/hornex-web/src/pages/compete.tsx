import Button from '@/components/ui/atoms/button';
import { LolFlatIcon } from '@/components/ui/atoms/icons/lol-flat-icon';
import { AppLayout } from '@/layouts';
import { GetAvailableGamesResponse } from '@/lib/models/types';
import { dataLoader as dataLoader } from '@/lib/request';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

const { fetch: getAvailableGames } =
  dataLoader<GetAvailableGamesResponse>('getAvailableGames');

const CompetePage = ({
  games,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="container mx-auto pt-8">
      <section id="available-games">
        <div className="space-y-10">
          <div className="">
            <h2 className="text-title text-left text-xl font-bold leading-4 lg:text-xl">
              Available Games
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href={`/pc/league-of-legends/tournaments`} className="group">
              <div className="">
                {/* header */}

                <div className="relative h-[200px] w-full rounded bg-[url('/images/summonersrift.jpg')] bg-cover bg-center bg-no-repeat">
                  <div className="p-4">
                    <LolFlatIcon className="text-title mr-4 h-10 w-10" />
                  </div>
                  <div className="absolute bottom-2 left-2 w-full">
                    <span className="text-title rounded-lg bg-black/50 px-2 text-xs">
                      143 opened
                    </span>
                    <span className="text-title rounded-lg bg-black/50 px-2 text-xs">
                      20 closed
                    </span>
                  </div>
                </div>
                <div className="bg-light-dark flex items-center p-4">
                  <h4 className="text-title font-bold">League of Legends</h4>
                </div>
                {/* bottom */}
              </div>
            </Link>
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
