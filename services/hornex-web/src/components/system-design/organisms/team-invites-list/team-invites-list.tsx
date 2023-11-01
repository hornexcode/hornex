import { Invite } from '@/lib/hx-app/types';
import { FC } from 'react';

type TeamInvitesListProps = {
  invites: Invite[];
};

export const TeamInvitesList: FC<TeamInvitesListProps> = ({ invites }) => {
  return invites.map((invite, i) => <div key={i}>{invite.team.name}</div>);
  // TODO : Design invite item
  // <TeamInvitesItem key={team.id} {...team} />);
};
