import { useTournament } from '@/contexts';
import { Prize } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import React from 'react';

const { useData: useGetTournamentPrizesQuery } = dataLoader<Prize[]>(
  'getTournamentPrizes'
);

const TournamentDetailsPrizesTabContent = () => {
  const { tournament } = useTournament();

  const {
    data: prizes,
    isLoading,
    error,
  } = useGetTournamentPrizesQuery({
    tournamentId: tournament.id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !prizes) {
    return <div>Error</div>;
  }

  return (
    <div>
      {prizes.map((prize, index) => (
        <Prize key={index} prize={prize} />
      ))}
    </div>
  );
};

const Prize = ({ prize }: { prize: Prize }) => {
  const places: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd' };
  return (
    <div className="border-border bg-muted/40 mb-2 grid grid-cols-12 rounded border">
      <div className="col-span-1 flex justify-center p-6">
        <div className="flex h-full items-center">
          <h4 className="text-title font-roboto text-4xl font-extrabold tracking-tight">
            {places[prize.place]}
          </h4>
        </div>
      </div>
      <div className="border-border col-span-10 border-l px-8">
        <div className="flex h-full items-center justify-between">
          <div className="font-medium">{prize.content}</div>
        </div>
      </div>
    </div>
  );
};
export default TournamentDetailsPrizesTabContent;
