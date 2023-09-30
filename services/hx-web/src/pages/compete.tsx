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
import { AppLayout } from '@/layouts';
import { requestFactory as requestFactory } from '@/lib/api';
import { GetAvailableGamesResponse } from '@/lib/hx-app/types';
import { ComputerDesktopIcon } from '@heroicons/react/20/solid';
import { PlusCircleIcon } from 'lucide-react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

const { fetch: getAvailableGames } =
  requestFactory<GetAvailableGamesResponse>('getAvailableGames');

const CompetePage = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  const games: GameItemProps[] = [
    {
      bgImage: '/images/card-background-lol.png',
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
      bgImage: '/images/bg-cs-go.png',
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
      bgImage: '/images/bg-dota.webp',
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
      bgImage: '/images/bg-rocket-league.webp',
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
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left text-xl font-bold leading-4 text-white lg:text-xl">
          Connected Games
        </h2>

        <PlatformPicker />
      </div>

      <section id="connected-games" className="space-y-10">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="bg-light-dark flex min-h-[14rem] cursor-pointer flex-col items-center justify-center gap-4 rounded p-4 transition-all hover:bg-slate-700">
              <PlusCircleIcon className="w-7" />
              <span className="text-sm font-medium text-slate-400">
                Connect to new game
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="available-games">
        <div className="space-y-10">
          <div className="mb-4 border-b border-slate-800 pb-2">
            <h2 className="text-left text-xl font-bold leading-4 text-white lg:text-xl">
              Available Games
            </h2>
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
  const { data, error } = await getAvailableGames({}, req);

  return {
    props: {},
  };
};

export default CompetePage;
