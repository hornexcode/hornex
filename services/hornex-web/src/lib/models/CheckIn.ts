export type ParticipantCheckedInStatus = {
  checked_in: boolean;
};

export type TeamCheckInStatus = {
  tournament: string;
  team: string;
  checked_in: boolean;
  total: number;
  users: string[];
};
