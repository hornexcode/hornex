import CSChar from '@/assets/images/cs-char.png';
import DotaChar from '@/assets/images/dota-char.png';
import LolChar from '@/assets/images/lol-bg-char.png';
import RocketLeagueChar from '@/assets/images/rl-char.png';
import { GameItemProps, PlatformPicker } from '@/components/compete';
import {
  CounterStrikeLogoIcon,
  DotaLogoIcon,
  LolLogoIcon,
  PlayStationIcon,
  RocketLeagueLogoIcon,
  XboxIcon,
} from '@/components/ui/icons';
import { LeagueOfLegendsLogo } from '@/components/ui/icons/league-of-legends-icon';
import routes from '@/config/routes';
import { AppLayout } from '@/layouts';
import { dataLoader as dataLoader } from '@/lib/api';
import { Game, GetAvailableGamesResponse } from '@/lib/hx-app/types';
import { ComputerDesktopIcon } from '@heroicons/react/20/solid';
import { PlusCircleIcon } from 'lucide-react';
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
      {/* <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left text-xl font-bold leading-4 text-white lg:text-xl">
          Connected Games
        </h2>

        <PlatformPicker />
      </div> */}

      {/* <section id="connected-games" className="space-y-10">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="bg-light-dark flex min-h-[300px] cursor-pointer flex-col items-center justify-center gap-4 rounded p-4 transition-all hover:bg-slate-700">
              <PlusCircleIcon className="w-7" />
              <span className="text-sm font-medium text-slate-400">
                Connect to new game
              </span>
            </div>
          </div>
        </div>
      </section> */}

      <section id="available-games">
        <div className="space-y-10">
          <div className="mb-4 border-b border-slate-800 pb-2">
            <h2 className="text-left text-xl font-bold leading-4 text-white lg:text-xl">
              Available Games
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.map((game: Game) => (
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
  const { data: games, error } = await getAvailableGames({}, req);

  if (error && error.code === 401) {
    return {
      redirect: {
        destination: routes.login,
        permanent: false,
      },
    };
  }

  return {
    props: {
      games,
    },
  };
};

export default CompetePage;
