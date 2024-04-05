import { Standing as StandingType } from '@/lib/models/Standing';
import { FC } from 'react';

type TournamentStandingsTabContentProps = {
  standings: StandingType[];
};

const TournamentStandingsTabContent: FC<TournamentStandingsTabContentProps> = ({
  standings,
}) => {
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
    <div className="border-border bg-muted/40 mb-2 grid grid-cols-12 rounded border">
      <div className="col-span-1">
        <div className="flex h-full items-center justify-center p-4">
          <div className="text-title text-4xl font-bold">{tier}</div>
        </div>
      </div>
      <div className="border-border col-span-4 border-l">
        <div className="p-4 ">
          <h4 className="text-title font-medium">{standing.team.name}</h4>
          <div className="text-body font-display font-bold">
            {standing.wins}W - {standing.losses}L
          </div>
        </div>
      </div>
    </div>
  );
};
export default TournamentStandingsTabContent;
