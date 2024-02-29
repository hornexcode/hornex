import { Registration, Tournament } from '@/lib/models';

export type GameID = {
  id: string;
  nickname: string;
  game: string;
};

export type TournamentHeadlineProps = {
  isCheckedIn?: boolean;
};
