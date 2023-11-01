import { TeamInviteListItem } from '../../molecules/team-invite-list-item';
import { TeamInvite } from '@/lib/hx-app/types';

export type TeamInviteListProps = {
  isReadOnly?: boolean;
  invites?: TeamInvite[];
  onRemove?: (invite: TeamInvite) => void;
};

export const TeamInviteList = ({
  invites,
  isReadOnly,
  onRemove,
}: TeamInviteListProps) => {
  return (
    <div className="space-y-4">
      {invites &&
        invites.map(({ id, user, accepted_at, declined_at, expired_at }) => (
          <TeamInviteListItem
            key={id}
            invite={{ accepted_at, declined_at, expired_at }}
            user={user}
            isReadOnly={isReadOnly}
            onRemove={onRemove}
          />
        ))}
    </div>
  );
};
