import { tournament } from './entities';
import z from 'zod';

export type GetTournamentResponse = z.infer<typeof tournament>;
