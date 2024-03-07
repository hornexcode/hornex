import { Tournament } from '@/lib/models';
import { Standing } from '@/lib/models/Standing';
import { dataLoader } from '@/lib/request';

const { submit: updateTournament } = dataLoader<
  Tournament,
  Partial<Tournament>
>('organizer:tournament:update');

const openRegistrationHandler = ({ tournamentId }: { tournamentId: string }) =>
  updateTournament(
    { tournamentId },
    {
      status: 'registering',
      registration_start_date: new Date(),
    }
  );

const { submit: startTournament } = dataLoader<
  Tournament,
  { timestamp: number; now: Date }
>('org:tournament:start');

const startTournamentHandler = ({ tournamentId }: { tournamentId: string }) =>
  startTournament(
    { id: tournamentId },
    {
      timestamp: Date.now(),
      now: new Date(),
    }
  );

const { submit: checkInTournament } = dataLoader('org:tournament:check-in');

const checkInTournamentHandler = ({ tournamentId }: { tournamentId: string }) =>
  checkInTournament({ tournamentId });

const { submit: finalizeTournament } = dataLoader<Tournament>(
  'org:tournament:finalize'
);

const finalizeTournamentHandler = ({ id }: { id: string }) =>
  finalizeTournament({ id });

const { useData: getTournamentResults } = dataLoader<Standing[]>(
  'org:tournament:results'
);

const useGetTournamentResults = ({ id }: { id: string }) =>
  getTournamentResults({ tournamentId: id });

export {
  checkInTournamentHandler,
  finalizeTournamentHandler,
  openRegistrationHandler,
  startTournamentHandler,
  useGetTournamentResults,
};
