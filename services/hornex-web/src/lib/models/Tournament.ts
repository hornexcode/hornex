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
  start_time: z.string(),
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
  total_participants: z.number(),
});
export type Tournament = z.infer<typeof tournamentSchema>;

export const status: Record<string, string> = {
  announced: 'Announced',
  registering: 'Registration Open',
  running: 'Running',
  finished: 'Finished',
  cancelled: 'Cancelled',
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

export function getStartAt(tournament: Tournament) {
  return (
    moment(new Date(tournament.start_date)).format('DD/MM/YYYY') +
    ' at ' +
    moment(new Date(tournament.start_time)).format('hh:mm A')
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

export function getPotentialPrizePool(tournnament: Tournament): number {
  return tournnament.prize_pool_enabled
    ? tournnament.entry_fee *
        tournnament.max_teams *
        tournnament.team_size *
        0.7
    : 0;
}
