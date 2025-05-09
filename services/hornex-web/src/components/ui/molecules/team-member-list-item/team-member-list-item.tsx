import Button from '@/components/ui/atoms/button';
import { ProfileIcon } from '@/components/ui/atoms/icons';
import { TeamMember } from '@/lib/models/types';
import classnames from 'classnames';
import { Crown, CrownIcon, LucideCrown } from 'lucide-react';

export type TeamMemberListItemProps = {
  className?: string;
  isReadOnly?: boolean;
  isOwner?: boolean;
  member: {
    id: string;
    name: string;
    email: string;
  };
  onRemove: (id: string) => void;
};

export const TeamMemberListItem = ({
  member,
  onRemove,
  isReadOnly = false,
  isOwner = false,
  className,
}: TeamMemberListItemProps) => {
  return (
    <div
      className={classnames(
        'dark:bg-light-dark mb-4 flex items-center justify-between rounded-lg bg-white p-3 text-sm font-medium tracking-wider shadow-sm sm:p-4',
        className
      )}
    >
      <div className="flex items-center">
        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-600">
          <ProfileIcon className="absolute -left-1 h-10 w-10 text-gray-400" />
        </div>
        <div className="ml-2 rtl:mr-2">
          <span className="text-title"> {member.name}</span>
          <span className="block pt-0.5 text-xs font-normal text-gray-600 dark:text-gray-400">
            {member.email}
          </span>
        </div>
      </div>

      {isOwner && (
        <div className="flex">
          <CrownIcon className="mr-2 h-5 w-5 text-yellow-500" />
          <span className="mr-2 text-sm font-normal text-gray-600 dark:text-gray-400">
            Owner
          </span>
        </div>
      )}

      {!isReadOnly && (
        <Button
          size="mini"
          color="danger"
          shape="rounded"
          variant="transparent"
          onClick={() => onRemove(member.id)}
        >
          Remover
        </Button>
      )}
    </div>
  );
};
