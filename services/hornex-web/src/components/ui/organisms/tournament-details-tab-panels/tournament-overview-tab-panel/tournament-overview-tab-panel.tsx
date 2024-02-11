import { SwordsIcon } from '@/components/ui/atoms/icons';
import { LolFlatIcon } from '@/components/ui/atoms/icons/lol-flat-icon';
import { Tournament } from '@/lib/models/types';
import { PlusIcon } from '@heroicons/react/20/solid';
import { FC } from 'react';

type TournamentOverviewTabPanelProps = {
  tournament: Tournament;
};

export const TournamentOverviewTabPanel: FC<
  TournamentOverviewTabPanelProps
> = ({ tournament }) => {
  return (
    <div className="box space-y-12">
      <div className="flex flex-wrap items-center p-2">
        <div className="block border-r border-gray-700 pr-6">
          <h4 className="mb-2 text-sm leading-none tracking-wide">Game</h4>
          <span className="text-title font-light">League of Legends</span>
        </div>
        <div className="block border-r border-gray-700 px-6">
          <h4 className="mb-2 text-sm leading-none tracking-wide">Platform</h4>
          <span className="text-title font-light">PC</span>
        </div>
        <div className="block border-r border-gray-700 px-6">
          <h4 className="mb-2 text-sm leading-none tracking-wide">Format</h4>
          <span className="text-title font-light">
            {tournament.team_size}x{tournament.team_size}
          </span>
        </div>

        <div className="block px-6">
          <h4 className="mb-2 text-sm leading-none tracking-wide">Map</h4>
          <span className="text-title font-light">Summoner Rift</span>
        </div>
      </div>
    </div>
  );
};
