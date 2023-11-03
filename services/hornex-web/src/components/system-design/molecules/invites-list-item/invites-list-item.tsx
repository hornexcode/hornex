import Button from '@/components/ui/button';
import { dataLoader } from '@/lib/api';
import { Invite } from '@/lib/hx-app/types';
import { AcceptInviteRequestParams } from '@/lib/hx-app/types/rest/accept-invite';
import { DeclineInviteRequestParams } from '@/lib/hx-app/types/rest/decline-invite';
import { ComputerDesktopIcon } from '@heroicons/react/20/solid';
import { CheckCircleIcon, Gamepad2Icon, XCircleIcon } from 'lucide-react';
import { FC } from 'react';
import { toast } from 'react-toastify';

type InviteProps = {
  invite: Invite;
};

const { post: acceptInvite } = dataLoader<undefined, AcceptInviteRequestParams>(
  'acceptInvite'
);
const { post: declineInvite } = dataLoader<
  undefined,
  DeclineInviteRequestParams
>('declineInvite');

export const InvitesListItem: FC<InviteProps> = ({ invite }) => {
  const acceptInviteHandler = async () => {
    const { error } = await acceptInvite({ invite_id: invite.id });
    if (error?.response) {
      return toast.error(error.response.message);
    }
    toast.success('Invite accept successfully');
  };

  const declineInviteHandler = async () => {
    const { error } = await declineInvite({ invite_id: invite.id });
    if (error?.response) {
      return toast.error(error.response.message);
    }
    toast.success('Invite declined successfully');
  };

  return (
    <div className="bg-light-dark shadow-light space-y-4 rounded-lg transition-all hover:cursor-pointer hover:outline sm:p-6">
      <div className="flex items-center justify-between border-b border-dashed border-gray-700 pb-4">
        <div className="block">
          <h4 className="text-sm font-semibold text-slate-200">
            {invite.team.name}
          </h4>
        </div>
        <div className="actions flex gap-2">
          <Button
            variant="transparent"
            size="mini"
            shape="circle"
            onClick={() => acceptInviteHandler()}
          >
            <CheckCircleIcon className="w-6 text-green-400" />
          </Button>
          <Button
            variant="transparent"
            size="mini"
            shape="circle"
            onClick={() => declineInviteHandler()}
          >
            <XCircleIcon className="w-6 text-red-500" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-6">
        {/* platform */}
        <div className="block">
          <div className="flex items-center">
            <div className="flex h-8 w-8 shrink-0 rounded-full bg-gray-700 text-gray-400">
              <ComputerDesktopIcon className="m-auto h-4 w-4" />
            </div>
            <div className="ml-4 flex flex-col justify-between">
              <div className="text-gray-400">platform</div>
              <div className="text-sm font-medium text-white">
                {invite.team.platform}
              </div>
            </div>
          </div>
        </div>

        {/* game */}
        <div className="block">
          <div className="flex items-center">
            <div className="flex h-8 w-8 shrink-0 rounded-full bg-gray-700 text-gray-400">
              <Gamepad2Icon className="m-auto h-4 w-4" />
            </div>
            <div className="ml-4 flex flex-col justify-between">
              <div className="text-gray-400">game</div>
              <div className="text-sm font-medium text-white">
                {invite.team.game}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
