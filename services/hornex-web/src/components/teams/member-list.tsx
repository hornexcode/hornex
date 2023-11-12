import Button from '@/components/ui/atoms/button/button';
import { Member } from '@/domain';
import { TrashIcon } from '@heroicons/react/20/solid';
import { FC } from 'react';

type MemberListProps = {
  members: Member[];
  onRemoveMember: (id: number) => void;
};

type MemberListItemProps = {
  member: Member;
  onRemoveMember: (id: number) => void;
};

const MemberListItem: FC<MemberListItemProps> = ({
  member,
  onRemoveMember,
}) => (
  <li className="bg-light-dark flex items-center rounded p-4">
    <span className="text-white">{member.username}</span>
    <div className="ml-auto">
      <Button
        color="danger"
        size="mini"
        shape="rounded"
        className="ml-auto"
        onClick={() => onRemoveMember(member.id)}
      >
        <div className="flex items-center">
          <TrashIcon className="mr-1 h-4 w-4" /> Remove
        </div>
      </Button>
    </div>
  </li>
);

export const MemberList: FC<MemberListProps> = ({
  members,
  onRemoveMember,
}) => {
  return (
    <ul className="space-y-4">
      {members.map((member) => (
        <MemberListItem
          key={member.id}
          member={member}
          onRemoveMember={onRemoveMember}
        />
      ))}
    </ul>
  );
};
