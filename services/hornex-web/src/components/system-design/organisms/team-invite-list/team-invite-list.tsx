import { TeamInviteListItem } from '../../molecules/team-invite-list-item';
import { TeamInvite } from '@/lib/hx-app/types';

export type TeamInviteListProps = {
  isReadOnly?: boolean;
  invites?: TeamInvite[];
  onRemove: (id: string) => void;
};

export const TeamInviteList = ({
  invites,
  isReadOnly,
  onRemove,
}: TeamInviteListProps) => {
  return (
    <div className="space-y-4">
      {invites &&
        invites.map((invite) => (
          <TeamInviteListItem
            key={invite.id}
            invite={invite}
            user={invite.user}
            isReadOnly={isReadOnly}
            onRemove={onRemove}
          />
        ))}
    </div>
  );
};
