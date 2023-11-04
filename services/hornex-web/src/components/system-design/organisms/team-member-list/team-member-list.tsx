import { TeamMemberListItem } from '../../molecules/team-member-list-item';
import { Team, TeamMember } from '@/lib/hx-app/types';
import classnames from 'classnames';

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
            className={classnames({
              'dark:bg-light-dark/50 ': member.user.id === team.created_by,
            })}
            key={member.id}
            member={{
              // To operate the remove we need `member id` instead of `user id`
              id: member.id,
              email: member.user.email,
              name: member.user.name,
            }}
            // Team owner can't remove himself from the team
            isReadOnly={member.user.id === team.created_by || isReadOnly}
            isOwner={member.user.id === team.created_by}
            onRemove={onRemove}
          />
        ))}
    </div>
  );
};
