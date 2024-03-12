import { Standing as StandingType } from '@/lib/models/Standing';
import { FC } from 'react';

type AdminTournamentStandingsTabContentProps = {
  standings: StandingType[];
};

const AdminTournamentStandingsTabContent: FC<
  AdminTournamentStandingsTabContentProps
> = ({ standings }) => {
  return standings.map((standing, i) => (
    <Standing key={standing.id} standing={standing} tier={i + 1} />
  ));
};

type StandingProps = {
  tier: number;
  standing: StandingType;
};

const Standing: FC<StandingProps> = ({ standing, tier }) => {
  return (
    <div className="border-border bg-medium-dark grid grid-cols-5 border-b last:border-b-0">
      <div className="border-border col-span-1 flex h-full items-center justify-center border-r p-2">
        <div className="text-title font-lg font-bold">{tier}</div>
      </div>
      <div className="col-span-4 p-2">
        <div className="text-title">{standing.team.name}</div>
        <div className="text-body font-display">
          {standing.wins}W - {standing.losses}L
        </div>
      </div>
    </div>
  );
};
export default AdminTournamentStandingsTabContent;
