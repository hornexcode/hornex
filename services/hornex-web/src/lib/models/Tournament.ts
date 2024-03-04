import moment from 'moment';
import z from 'zod';

export const tournamentSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  description: z.string(),
  published: z.boolean(),
  status: z.enum(['announced', 'registering', 'running', 'ended', 'cancelled']),
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
  registered_teams: z.array(z.string()),
  classifications: z.string().array(),
  feature_image: z.string(),
  open_classification: z.boolean(),
  challonge_tournament_url: z.string(),
  checked_in: z.boolean(),
  total_participants: z.number(),
  current_round: z.number(),
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
  return '';
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
    case 'ended':
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

export const TournamentStatusOptions = {
  ANNOUNCED: 'announced',
  REGISTERING: 'registering',
  RUNNING: 'running',
  ENDED: 'ended',
  CANCELLED: 'cancelled',
};

export type TournamentStatus = keyof typeof TournamentStatusOptions;

export function getRounds(tournament: Tournament) {
  switch (tournament.max_teams) {
    case 4:
      return 2;
    case 8:
      return 3;
    case 16:
      return 4;
    case 32:
      return 5;
    default:
      break;
  }
}
