import { TeamsListItem } from '../../molecules/teams-list-item';
import { Team } from '@/domain';
import { FC } from 'react';

type TeamsListProps = {
  teams: Team[];
};

export const TeamsList: FC<TeamsListProps> = ({ teams }) => {
  return teams.map((team) => <TeamsListItem key={team.id} {...team} />);
};
