import { ComputerDesktopIcon } from '@heroicons/react/20/solid';
import * as Cookies from 'es-cookie';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

import CSChar from '@/assets/images/cs-char.png';
import DotaChar from '@/assets/images/dota-char.png';
import LolChar from '@/assets/images/lol-bg-char.png';
import RocketLeagueChar from '@/assets/images/rl-char.png';
import { GameItemProps } from '@/components/compete';
import {
  CounterStrikeLogoIcon,
  DotaLogoIcon,
  LolLogoIcon,
  PlayStationIcon,
  RocketLeagueLogoIcon,
  XboxIcon,
} from '@/components/ui/icons';
import { AppLayout } from '@/layouts';

const CompetePage = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  const games: GameItemProps[] = [
    {
      bgImage: 'http://localhost:3000/images/card-background-lol.png',
      LogoComponentIcon: LolLogoIcon,
      hoverImage: LolChar,
      bgColor: 'sky',
      platforms: [
        {
          Icon: ComputerDesktopIcon as (
            props: React.SVGAttributes<{}>
          ) => JSX.Element,
          bgColor: 'bg-sky-500',
        },
      ],
      matchFormat: '5v5',
      name: 'League of Legends',
      registeredPlayers: 12.29,
      tournaments: 23,
    },
    {
      bgImage: 'http://localhost:3000/images/bg-cs-go.png',
      LogoComponentIcon: CounterStrikeLogoIcon,
      hoverImage: CSChar,
      bgColor: 'yellow',
      platforms: [
        {
          Icon: XboxIcon,
          bgColor: 'bg-green-500',
        },
        {
          Icon: ComputerDesktopIcon as (
            props: React.SVGAttributes<{}>
          ) => JSX.Element,
          bgColor: 'bg-sky-500',
        },
        {
          Icon: PlayStationIcon,
          bgColor: 'bg-blue-900',
        },
      ],
      matchFormat: '5v5',
      name: 'CS:GO',
      registeredPlayers: 30,
      tournaments: 57,
    },
    {
      bgImage: 'http://localhost:3000/images/bg-dota.webp',
      LogoComponentIcon: DotaLogoIcon,
      hoverImage: DotaChar,
      bgColor: 'red',
      platforms: [
        {
          Icon: ComputerDesktopIcon as (
            props: React.SVGAttributes<{}>
          ) => JSX.Element,
          bgColor: 'bg-sky-500',
        },
      ],
      matchFormat: '5v5',
      name: 'Dota 2',
      registeredPlayers: 21.3,
      tournaments: 15,
    },
    {
      bgImage: 'http://localhost:3000/images/bg-rocket-league.webp',
      LogoComponentIcon: RocketLeagueLogoIcon,
      hoverImage: RocketLeagueChar,
      bgColor: 'purple',
      platforms: [
        {
          Icon: XboxIcon,
          bgColor: 'bg-green-500',
        },
        {
          Icon: ComputerDesktopIcon as (
            props: React.SVGAttributes<{}>
          ) => JSX.Element,
          bgColor: 'bg-sky-500',
        },
        {
          Icon: PlayStationIcon,
          bgColor: 'bg-blue-900',
        },
      ],
      matchFormat: '5v5',
      name: 'Rocket League',
      registeredPlayers: 51,
      tournaments: 33,
    },
  ];
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
            <div className="flex min-h-[14rem] cursor-pointer flex-col items-center justify-center gap-4 rounded bg-light-dark p-4 transition-all hover:bg-slate-700">
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

          <div className="flex">
            <Link href="/compete/league-of-legends">
              <div className="space-y-4 rounded-lg">
                {/* <Image
                  src={LeagueOfLegends}
                  className="w-[250px] rounded-lg"
                  alt="league of legends"
                /> */}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = Cookies.parse(ctx.req.headers.cookie || '');
  if (
    cookies['hx-auth.token'] !== undefined &&
    cookies['hx-auth.token'] !== ''
  ) {
    return {
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default CompetePage;
