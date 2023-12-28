import { TeamInviteListItem } from '../../molecules/team-invite-list-item';
import { TeamInvite } from '@/lib/models/types';

export type TeamInviteListProps = {
  isReadOnly?: boolean;
  invites?: TeamInvite[];
  onCancel: (id: string) => void;
};

export const TeamInviteList = ({
  invites,
  isReadOnly,
  onCancel,
}: TeamInviteListProps) => {
  return (
    <div className="space-y-4">
      {invites &&
        invites.map((invite) => (
          <TeamInviteListItem
            key={invite.id}
            invite={invite}
            user={invite.user}
            cancelInvite={() => onCancel(invite.id)}
          />
        ))}
    </div>
  );
};
