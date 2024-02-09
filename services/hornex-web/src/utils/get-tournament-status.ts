type tournamentPhase =
  | 'registration_open'
  | 'results_tracking'
  | 'payment_pending'
  | 'finished_and_paid';

type tournamentStatus = 'open' | 'in progress' | 'closed';

export const getTournamentStatus = (
  value: tournamentPhase
): tournamentStatus | undefined => {
  if (value === 'registration_open') return 'open';
  if (value === 'results_tracking') return 'in progress';
  if (value === 'payment_pending') return 'in progress';
  if (value === 'finished_and_paid') return 'closed';
};
