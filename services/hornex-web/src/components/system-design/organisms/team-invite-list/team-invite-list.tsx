import Button from '@/components/ui/button';
import { ProfileIcon } from '@/components/ui/icons';
import { TeamInvite, User } from '@/lib/hx-app/types';

export type TeamInviteListItemProps = {
  isReadOnly?: boolean;
  invite: Partial<TeamInvite>;
  user: User;
  onRemove?: (invite: TeamInvite) => void;
};

export const TeamInviteListItem = ({
  isReadOnly = false,
  invite,
  user,
}: TeamInviteListItemProps) => {
  return (
    <div className="dark:bg-light-dark mb-4 flex items-center justify-between rounded-lg bg-white p-3 text-sm font-medium tracking-wider shadow-sm sm:p-4">
      <div className="flex items-center">
        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-600">
          <ProfileIcon className="absolute -left-1 h-10 w-10 text-gray-400" />
        </div>
        <div className="ml-2 rtl:mr-2">
          {user.name}
          <span className="block pt-0.5 text-xs font-normal text-gray-600 dark:text-gray-400">
            {user.email}
          </span>
        </div>
      </div>

      {!isReadOnly && (
        <Button
          size="mini"
          color="danger"
          shape="rounded"
          variant="transparent"
        >
          Cancelar
        </Button>
      )}
    </div>
  );
};

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

/* type InviteStatus = 'accepted' | 'declined' | 'pending';

const getInviteStatus = (
  accepted_at?: Date,
  declined_at?: Date,
  expired_at?: Date
): InviteStatus => {
  const status = {
    accepted: Boolean(accepted_at),
    declined: Boolean(declined_at),
    pending: Boolean(accepted_at) && Boolean(declined_at),
  };
  
  const result = Object.keys(status).
  
  switch (result) {
    case 'accepted':
      return 'accepted'  
    
    default:
      return 'pending'
  }
};
 */
