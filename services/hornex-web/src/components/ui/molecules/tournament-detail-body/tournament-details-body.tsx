import TournamentTabPanels from '../../organisms/tournament-tab-panels/tournament-tab-panels';
import { useTournament } from '@/contexts';
import { FC } from 'react';

const TournamentDetailsBody: FC = ({}) => {
  const { tournament } = useTournament();
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
