import { Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { useState } from 'react';

const { submit: updateTournament } = dataLoader<
  Tournament,
  Partial<Tournament>
>('test_mode:updateTournament');

const openRegistrationHandler = ({ tournamentId }: { tournamentId: string }) =>
  updateTournament(
    { tournamentId },
    {
      status: 'registration_open',
      registration_start_date: new Date(),
    }
  );

export { openRegistrationHandler };
