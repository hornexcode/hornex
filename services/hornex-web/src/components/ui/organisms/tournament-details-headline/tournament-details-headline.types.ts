import { Registration, Tournament } from '@/lib/models';

export type GameID = {
  id: string;
  nickname: string;
  game: string;
};

export type TournamentHeadlineProps = {
  tournament: Tournament;
  connectedGameId?: GameID;
  registration?: Registration;
  isCheckedIn?: boolean;
};
