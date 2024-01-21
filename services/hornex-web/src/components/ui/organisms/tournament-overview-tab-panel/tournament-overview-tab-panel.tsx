import { SwordsIcon } from '@/components/ui/atoms/icons';
import { Tournament } from '@/lib/models/types';
import { toCurrency } from '@/lib/utils';
import { ComputerDesktopIcon, LockOpenIcon } from '@heroicons/react/20/solid';
import { CoinsIcon } from 'lucide-react';
import { FC } from 'react';

type TournamentOverviewTabPanelProps = {
  tournament: Tournament;
};

const TournamentOverviewTabPanel: FC<TournamentOverviewTabPanelProps> = ({
  tournament,
}) => {
  return (
    <div className="box">
      <div className="flex flex-wrap items-center">
        <div className="block border-r border-gray-700 pr-6">
          <h4 className="text-body mb-2 text-sm leading-none tracking-wide">
            Game
          </h4>
          <span className="text-title rounded-md bg-slate-600 px-2 text-sm font-light">
            League of Legends
          </span>
        </div>
        <div className="block border-r border-gray-700 px-6">
          <h4 className="text-body mb-2 text-sm leading-none tracking-wide">
            Platform
          </h4>
          <span className="text-title rounded-md bg-slate-600 px-2 text-sm font-light">
            PC
          </span>
        </div>
        <div className="block border-r border-gray-700 px-6">
          <h4 className="text-body mb-2 text-sm leading-none tracking-wide">
            Format
          </h4>
          <span className="text-title text-sm font-light">
            {tournament.team_size}x{tournament.team_size}
          </span>
        </div>
        <div className="block border-r border-gray-700 px-6">
          <h4 className="text-body mb-2 text-sm leading-none tracking-wide">
            Entry Fee
          </h4>
          <span className="text-title text-sm font-light">
            ${' '}
            <span className="font-display">
              {toCurrency(tournament.entry_fee)}
            </span>{' '}
            <span className="text-xs">BRL</span>
          </span>
        </div>
        <div className="block border-r border-gray-700 px-6">
          <h4 className="text-body mb-2 text-sm leading-none tracking-wide">
            Potential Prize Pool
          </h4>
          <span className="text-title text-sm font-light">
            ${' '}
            <span className="font-display">
              {toCurrency(
                tournament.entry_fee *
                  tournament.max_teams *
                  tournament.team_size *
                  0.7
              )}
            </span>{' '}
            <span className="text-xs">BRL</span>
          </span>
        </div>
        <div className="block px-6">
          <h4 className="text-body mb-2 text-sm leading-none tracking-wide">
            Map
          </h4>
          <span className="text-title text-sm font-light">Summoner Rift</span>
        </div>
      </div>
    </div>
  );
};

export default TournamentOverviewTabPanel;
