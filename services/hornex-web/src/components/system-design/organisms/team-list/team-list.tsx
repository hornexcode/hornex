import { TeamListItem } from '../../molecules/team-list-item';
import { Team } from '@/domain';
import { FC } from 'react';

type TeamsListProps = {
  teams: Team[];
};

export const TeamsList: FC<TeamsListProps> = ({ teams }) => {
  return teams.map((team) => <TeamListItem key={team.id} {...team} />);
};
