import { Tournament } from '@/lib/models';
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
>('organizer:tournament:start');

const startTournamentHandler = ({ tournamentId }: { tournamentId: string }) =>
  startTournament(
    { tournamentId },
    {
      timestamp: Date.now(),
      now: new Date(),
    }
  );

export { openRegistrationHandler, startTournamentHandler };
