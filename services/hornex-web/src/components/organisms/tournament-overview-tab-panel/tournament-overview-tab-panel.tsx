import { Tournament } from '@/lib/hx-app/types';
import { UserIcon } from 'lucide-react';
import { FC } from 'react';

type TournamentOverviewTabPanelProps = {
  tournament: Tournament;
};

const TournamentOverviewTabPanel: FC<TournamentOverviewTabPanelProps> = ({
  tournament,
}) => {
  return (
    <div className="box">
      <div className="block space-y-8">
        <div className="block">
          <div className="text-heading-style mb-2 uppercase text-gray-200">
            Informações Gerais
          </div>
          <p className="text-sm ">{tournament.description}</p>
        </div>
        <div className="block">
          <div className="text-heading-style mb-2 uppercase text-gray-200">
            Format
          </div>
          <span className="text-sm font-semibold">Single elimination</span>
        </div>

        <div className="block">
          <div className="text-heading-style mb-2 uppercase text-gray-200">
            Team Size
          </div>
          <div className="text-sm">{tournament.team_size}</div>
        </div>
        <div className="block">
          <div className="text-heading-style mb-2 uppercase text-gray-200">
            Max Teams
          </div>
          <div className="text-sm">{tournament.max_teams}</div>
        </div>
        <div className="block">
          <div className="text-heading-style mb-2 uppercase text-gray-200">
            Game
          </div>
          <div className="text-sm">{tournament.game}</div>
        </div>
        <div className="block">
          <div className="text-heading-style mb-2 uppercase text-gray-200">
            Platform
          </div>
          <div className="text-sm">{tournament.platform}</div>
        </div>
        <div className="block">
          <div className="text-heading-style mb-2 uppercase text-gray-200">
            Organizer
          </div>
          <div className="text-sm">
            <UserIcon className="w-4" />
            {tournament.organizer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentOverviewTabPanel;
