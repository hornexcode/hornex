import { registerTeamFormSchema as form } from './tournament-registration-form.types';
import { Registration } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import z from 'zod';

export const { submit: registerTeamHandler } = dataLoader<
  Registration,
  z.infer<typeof form>
>('registerTeam');
