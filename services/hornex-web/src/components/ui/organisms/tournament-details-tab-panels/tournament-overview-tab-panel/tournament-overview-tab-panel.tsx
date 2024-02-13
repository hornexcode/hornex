import { EyeIcon } from '@/components/ui/atoms/icons';
import { Tournament } from '@/lib/models';
import { FC } from 'react';

type TournamentOverviewTabPanelProps = {
  tournament: Tournament;
};

export const TournamentOverviewTabPanel: FC<
  TournamentOverviewTabPanelProps
> = ({ tournament }) => {
  return (
    <div className="box space-y-12">
      <div className="block">
        <h3 className="text-title mb-4 text-lg font-bold">Game info</h3>
        <div className="flex flex-wrap items-center">
          <div className="block border-r border-dashed border-gray-700 pr-6 text-sm">
            <h4 className="mb-2 leading-none tracking-wide">Game</h4>
            <span className="font-semibold text-amber-400">
              League of Legends
            </span>
          </div>
          <div className="block border-r border-dashed border-gray-700 px-6 text-sm">
            <h4 className="mb-2 leading-none tracking-wide">Platform</h4>
            <span className="font-semibold text-amber-400">PC</span>
          </div>
          <div className="block border-r border-dashed border-gray-700 px-6 text-sm">
            <h4 className="mb-2 leading-none tracking-wide">Format</h4>
            <span className="font-semibold text-amber-400">
              {tournament.team_size}x{tournament.team_size}
            </span>
          </div>
          <div className="block border-gray-700 px-6 text-sm">
            <h4 className="mb-2 leading-none tracking-wide">Map</h4>
            <span className="font-semibold text-amber-400">Summoners Rift</span>
          </div>
        </div>
      </div>
      <div className="block">
        <h3 className="text-title mb-4 text-lg font-bold">Registered teams</h3>
        <div className="grid grid-cols-4">
          <div>
            <ul className="text-sm underline">
              <li className="pb-1 hover:cursor-pointer hover:text-amber-400">
                <div className="flex items-center">
                  Pain Gaming <EyeIcon className="ml-2 w-4" />
                </div>
              </li>
              <li className="pb-1 hover:cursor-pointer hover:text-amber-400">
                <div className="flex items-center">
                  NFT <EyeIcon className="ml-2 w-4" />
                </div>
              </li>
              <li className="pb-1 hover:cursor-pointer hover:text-amber-400">
                <div className="flex items-center">
                  Flamengo <EyeIcon className="ml-2 w-4" />
                </div>
              </li>
            </ul>
          </div>
          <div>
            <ul className="text-sm underline">
              <li className="pb-1 hover:cursor-pointer hover:text-amber-400">
                <div className="flex items-center">
                  Pain Gaming <EyeIcon className="ml-2 w-4" />
                </div>
              </li>
              <li className="pb-1 hover:cursor-pointer hover:text-amber-400">
                <div className="flex items-center">
                  NFT <EyeIcon className="ml-2 w-4" />
                </div>
              </li>
              <li className="pb-1 hover:cursor-pointer hover:text-amber-400">
                <div className="flex items-center">
                  Flamengo <EyeIcon className="ml-2 w-4" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="block">
        <h3 className="text-title text-lg font-bold">Sponsors & Partners</h3>
      </div>
    </div>
  );
};
