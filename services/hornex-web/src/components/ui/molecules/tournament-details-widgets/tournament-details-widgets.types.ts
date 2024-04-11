import { Profile } from '@/lib/models/Profile'; 
import { Tournament } from '@/lib/models/Tournament';

export type TournamentDetailsWidgetsProps = {
  loading?: boolean;
  profile?: Profile;
  registered: boolean;
  tournament: Tournament;
};
