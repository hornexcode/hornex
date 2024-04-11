import TournamentTabPanels from '../../organisms/tournament-tab-panels/tournament-tab-panels';
import { TournamentDetailsBodyProps } from './tournament-details-body.types';
import { FC } from 'react';

const TournamentDetailsBody: FC<TournamentDetailsBodyProps> = ({ tournament }) => {
  return (
    <div className="grid w-full">
      <TournamentTabPanels tournament={tournament} />
      <div className="mt-10">
        <div className="flex items-center"></div>
      </div>
    </div>
  );
};

export default TournamentDetailsBody;