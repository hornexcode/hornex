import Button from '@/components/ui/button';
import { ProfileIcon } from '@/components/ui/icons';
import { TeamInvite, User } from '@/lib/hx-app/types';

export type TeamInviteListItemProps = {
  isReadOnly?: boolean;
  invite: TeamInvite;
  user: User;
  cancelInvite: (id: string) => void;
};

export const TeamInviteListItem = ({
  isReadOnly = false,
  invite,
  user,
  cancelInvite,
}: TeamInviteListItemProps) => {
  return (
    <div className="dark:bg-light-dark/50 mb-4 flex items-center justify-between rounded-lg bg-white p-3 text-sm font-medium tracking-wider shadow-sm sm:p-4">
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

      <div className="self-end">
        <span className="mr-2 italic text-gray-400">Pending</span>

        {!isReadOnly && (
          <Button
            size="mini"
            color="danger"
            shape="rounded"
            variant="transparent"
            onClick={() => cancelInvite(invite.id)}
          >
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
};
