import { TeamMemberListItem } from '../../molecules/team-member-list-item';
import { TeamMember } from '@/lib/hx-app/types';

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
