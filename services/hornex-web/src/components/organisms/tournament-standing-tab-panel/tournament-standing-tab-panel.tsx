import TournamentLeaderBoardTable from '@/components/molecules/tournament-leader-board-table';
import { Tournament } from '@/lib/hx-app/types';
import { FC } from 'react';

type TournamentStandingTabPanelProps = {
  tournament: Tournament;
};

const TournamentStandingTabPanel: FC<TournamentStandingTabPanelProps> = ({
  tournament,
}) => {
  return (
    <div className="bg-light-dark rounded-lg shadow-md">
      <div className="border-b-2 border-gray-800 p-5">
        <h4 className="leading-2 text-sm font-medium uppercase text-gray-200">
          leader board
        </h4>
      </div>
      <TournamentLeaderBoardTable />
    </div>
  );
};

export default TournamentStandingTabPanel;
