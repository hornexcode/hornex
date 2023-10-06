import TournamentCardInfo from '@/components/molecules/tournament-card-info/tournament-card-info';
import { LOLTournament } from '@/lib/hx-app/types';
import { FC } from 'react';

export type TournamentsTemplateProps = {
  tournaments: {
    count: number;
    next: string | null;
    previous: string | null;
    results: LOLTournament[];
  };
  isLoading: boolean;
};

const TournamentsTemplate: FC<TournamentsTemplateProps> = ({
  isLoading,
  tournaments,
}) => {
  return (
    <section className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left text-xl font-bold leading-4 text-white lg:text-xl">
          Tournaments
        </h2>
      </div>
      <div className="grid grid-cols-5 gap-5">
        {!isLoading &&
          tournaments.results.map((tournament) => (
            <TournamentCardInfo key={tournament.id} tournament={tournament} />
          ))}
      </div>
    </section>
  );
};

export default TournamentsTemplate;
