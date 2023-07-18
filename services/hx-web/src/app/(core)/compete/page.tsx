'use client';

import { ComputerDesktopIcon, PlusCircleIcon } from '@heroicons/react/20/solid';
import { GameItem, GameItemProps, PlatformPicker } from '@/components/compete';
import LolChar from '@/assets/images/lol-bg-char.png';
import DotaChar from '@/assets/images/dota-char.png';
import CSChar from '@/assets/images/cs-char.png';
import RocketLeagueChar from '@/assets/images/rl-char.png';
import {
  LolLogoIcon,
  RocketLeagueLogoIcon,
  CounterStrikeLogoIcon,
  DotaLogoIcon,
  CellPhoneIcon,
  PlayStationIcon,
  XboxIcon,
} from '@/components/ui/icons';

export default function Compete() {
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
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
          Connected Games
        </h2>

        <PlatformPicker />
      </div>

      <section id="connected-games" className="space-y-10">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="flex min-h-[18rem] cursor-pointer flex-col items-center justify-center gap-4 rounded-lg bg-slate-800 p-4 transition-all hover:bg-slate-700">
              <PlusCircleIcon className="w-7" />
              <span className="text-sm">Add game</span>
            </div>
          </div>
        </div>
      </section>

      <section id="available-games">
        <div className="space-y-10">
          <div className="mb-4 border-b border-slate-800 pb-2">
            <h2 className="text-left text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
              Available Games
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.map((game, index) => (
              <GameItem
                key={index}
                bgImage={game.bgImage}
                hoverImage={game.hoverImage}
                LogoComponentIcon={game.LogoComponentIcon}
                bgColor={game.bgColor}
                matchFormat={game.matchFormat}
                name={game.name}
                platforms={game.platforms}
                registeredPlayers={game.registeredPlayers}
                tournaments={game.tournaments}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
