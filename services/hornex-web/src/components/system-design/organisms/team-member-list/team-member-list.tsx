import { TeamMemberListItem } from '../../molecules/team-member-list-item';
import { Team, TeamMember } from '@/lib/hx-app/types';

export type TeamMemberListProps = {
  isReadOnly?: boolean;
  members?: TeamMember[];
  onRemove: (id: string) => void;
  team: Team;
};

export const TeamMemberList = ({
  members,
  isReadOnly,
  onRemove,
  team,
}: TeamMemberListProps) => {
  return (
    <div className="space-y-4">
      {members &&
        members.map((member) => (
          <TeamMemberListItem
            key={member.id}
            member={{
              // To operate the remove we need `member id` instead of `user id`
              id: member.id,
              email: member.user.email,
              name: member.user.name,
            }}
            // Team owner can't remove himself from the team
            isReadOnly={member.user.id === team.created_by || isReadOnly}
            onRemove={onRemove}
          />
        ))}
    </div>
  );
};
