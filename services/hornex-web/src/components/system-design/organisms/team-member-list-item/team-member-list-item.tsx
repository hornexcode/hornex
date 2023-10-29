import Button from '@/components/ui/button';

export type TeamMember = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: string;
};

export type TeamMemberListItemProps = {
  isReadOnly?: boolean;
  member?: TeamMember;
  onRemove?: (member: TeamMember) => void;
};

const TeamMemberListItem = ({
  isReadOnly = false,
}: TeamMemberListItemProps) => {
  return (
    <div className="dark:bg-light-dark flex items-center justify-between rounded-lg bg-white p-3 text-sm font-medium tracking-wider shadow-sm sm:p-4">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full sm:h-10 sm:w-10"></div>
        <div className="ltr:ml-2 rtl:mr-2">
          POOLTOGETHER
          <span className="block pt-0.5 text-xs font-normal capitalize text-gray-600 dark:text-gray-400">
            Ethereum
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

export default TeamMemberListItem;
