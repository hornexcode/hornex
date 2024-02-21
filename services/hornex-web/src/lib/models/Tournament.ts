import moment from 'moment';
import z from 'zod';

export const tournamentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  published: z.boolean(),
  status: z.enum([
    'announced',
    'registering',
    'running',
    'finished',
    'cancelled',
  ]),
  currency: z.enum(['USD', 'EUR', 'BRL']),
  start_date: z.string(),
  registration_start_date: z.date(),
  check_in_duration: z.number(),
  end_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  is_entry_free: z.boolean(),
  prize_pool_enabled: z.boolean(),
  prize_pool: z.number(),
  entry_fee: z.number(),
  max_teams: z.number(),
  team_size: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  organizer: z.string(),
  game: z.string(),
  platform: z.string(),
  teams: z.array(z.string()),
  classifications: z.string().array(),
  feature_image: z.string(),
  open_classification: z.boolean(),
  challonge_tournament_url: z.string(),
});
export type Tournament = z.infer<typeof tournamentSchema>;

export const status: Record<string, string> = {
  draft: 'Draft',
  registration_open: 'Registration Open',
  check_in: 'Check In',
  in_progress: 'In Progress',
  finished: 'Finished',
};

export type TournamentPhase = keyof typeof status;

export function getStatus(tournament: Tournament) {
  return status[tournament.status];
}

export function getEntryFee(tournament: Tournament) {
  return tournament.is_entry_free
    ? 'Free'
    : `${tournament.currency} ${(tournament.entry_fee / 100).toFixed(2)}`;
}

export function getClassifications(tournament: Tournament) {
  if (tournament.open_classification) return 'All';
  return tournament.classifications.join(', ');
}

export function getPotentialPrizePool(tournament: Tournament) {
  return tournament.prize_pool_enabled
    ? `${tournament.currency} ${(
        (tournament.entry_fee * tournament.max_teams * tournament.team_size) /
        100
      ).toFixed(2)}`
    : 'N/A';
}

export function getStartAt(tournament: Tournament) {
  return (
    moment(new Date(tournament.start_date)).format('DD/MM/YYYY') +
    ' at ' +
    tournament.start_time +
    `${new Date().getTimezoneOffset() / -60}`
  );
}

const game: Record<string, string> = {
  'league-of-legends': 'League of Legends',
};

export type TournamentGame = keyof typeof game;

export function getGame(tournament: Tournament): TournamentGame {
  return game[tournament.game];
}

export function getStatusStep(tournament: Tournament) {
  switch (tournament.status) {
    case 'announced':
      return [1, 4];
    case 'registering':
      return [2, 4];
    case 'running':
      return [3, 4];
    case 'finished':
      return [4, 4];
    default:
      return [0, 0];
  }
}
