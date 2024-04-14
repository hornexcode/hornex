import { Tournament } from '@/lib/models/Tournament';
import z from 'zod';

export type TournamentRegistrationFormProps = {
  tournament: Tournament;
};

export const registerTeamFormSchema = z.object({
  team_name: z.string(),
  tournament_id: z.string(),
  member_1_email: z.string().email(),
  member_2_email: z.string().email(),
  member_3_email: z.string().email(),
  member_4_email: z.string().email(),
  member_5_email: z.string().email(),
});
