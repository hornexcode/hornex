import { InvitesListItem } from '../../molecules/invites-list-item';
import { Invite } from '@/lib/models/types';
import { FC } from 'react';

type InvitesListProps = {
  invites: Invite[];
};

export const InvitesList: FC<InvitesListProps> = ({ invites }) => {
  return invites.map((invite) => (
    <InvitesListItem key={invite.id} invite={invite} />
  ));
};
