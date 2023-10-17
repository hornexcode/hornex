import { Game } from './game';
import { User } from './user';

export type Team = {
  id: string;
  name: string;
  created_by: string;
  game_id: string;
  // game: Game;
  // members: User[];
};
