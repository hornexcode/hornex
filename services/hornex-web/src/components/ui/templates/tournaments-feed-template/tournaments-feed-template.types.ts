import { GetTournamentsResponse } from '@/lib/models/types/rest/get-tournaments';

export type TournamentsPageTemplateProps = {
  data: GetTournamentsResponse;
  isLoading: boolean;
};
