import { Team, Tournament } from '@/lib/models';

export type TournamentCheckoutProps = {
  tournament: Tournament;
  team: Team;
};

export type PixResponse = {
  qrcode: string;
  imagemQrcode: string;
  linkVisualizacao: string;
};

export type PaymentMethod = 'pix' | 'credit-card';

export type PixContentProps = {
  pix: PixResponse;
};
