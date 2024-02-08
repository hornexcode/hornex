import { Tournament } from '@/lib/models';

export type TournamentsPageTemplateProps = {
  tournaments: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Tournament[];
  };
  isLoading: boolean;
};
