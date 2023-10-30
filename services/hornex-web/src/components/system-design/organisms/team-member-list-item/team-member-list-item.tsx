import Button from '@/components/ui/button';
import { TeamMember } from '@/lib/hx-app/types';

export type TeamMemberListItemProps = {
  isReadOnly?: boolean;
  member?: {
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
    <div className="dark:bg-light-dark flex items-center justify-between rounded-lg bg-white p-3 text-sm font-medium tracking-wider shadow-sm sm:p-4">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full sm:h-10 sm:w-10"></div>
        <div className="ltr:ml-2 rtl:mr-2">
          {member?.name}
          <span className="block pt-0.5 text-xs font-normal capitalize text-gray-600 dark:text-gray-400">
            {member?.email}
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
    members &&
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
    ))
  );
};
