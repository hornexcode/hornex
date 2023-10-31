import Button from '@/components/ui/button';
import { ProfileIcon } from '@/components/ui/icons';
import { TeamMember } from '@/lib/hx-app/types';

export type TeamMemberListItemProps = {
  isReadOnly?: boolean;
  member: {
    id: string;
    name: string;
    email: string;
  };
  onRemove?: (member: TeamMember) => void;
};

export const TeamMemberListItem = ({
  isReadOnly = false,
  member,
}: TeamMemberListItemProps) => {
  return (
    <div className="dark:bg-light-dark mb-4 flex items-center justify-between rounded-lg bg-white p-3 text-sm font-medium tracking-wider shadow-sm sm:p-4">
      <div className="flex items-center">
        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-600">
          <ProfileIcon className="absolute -left-1 h-10 w-10 text-gray-400" />
        </div>
        <div className="ml-2 rtl:mr-2">
          {member.name}
          <span className="block pt-0.5 text-xs font-normal text-gray-600 dark:text-gray-400">
            {member.email}
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
          Remover
        </Button>
      )}
    </div>
  );
};

export type TeamMemberListProps = {
  isReadOnly?: boolean;
  members?: TeamMember[];
  onRemove?: (member: TeamMember) => void;
};

export const TeamMemberList = ({
  members,
  isReadOnly,
  onRemove,
}: TeamMemberListProps) => {
  return (
    <div className="space-y-4">
      {members &&
        members.map((member) => (
          <TeamMemberListItem
            key={member.id}
            member={{
              email: member.user.email,
              id: member.user.id,
              name: member.user.name,
            }}
            isReadOnly={isReadOnly}
            onRemove={onRemove}
          />
        ))}
    </div>
  );
};
