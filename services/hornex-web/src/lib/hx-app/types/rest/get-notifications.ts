import { notification } from './entities';
import z from 'zod';

export const getNotifications = z.array(notification);
export type GetNotificationsResponse = z.infer<typeof getNotifications>;
