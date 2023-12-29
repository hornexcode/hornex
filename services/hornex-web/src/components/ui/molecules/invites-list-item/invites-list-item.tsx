import Button from '@/components/ui/atoms/button';
import { dataLoader } from '@/lib/api';
import { Invite } from '@/lib/models/types';
import { AcceptInviteRequestParams } from '@/lib/models/types/rest/accept-invite';
import { DeclineInviteRequestParams } from '@/lib/models/types/rest/decline-invite';
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

const { useData: useCountUserInvites } = dataLoader<number>('countUserInvites');

export const InvitesListItem: FC<InviteProps> = ({ invite }) => {
  const { mutate } = useCountUserInvites({
    status: 'pending',
  });

  const acceptInviteHandler = async () => {
    const { error } = await acceptInvite({ invite_id: invite.id });
    if (error?.response) {
      return toast.error(error.response.message);
    }
    mutate();
    toast.success('Invite accept successfully');
  };

  const declineInviteHandler = async () => {
    const { error } = await declineInvite({ invite_id: invite.id });
    if (error?.response) {
      return toast.error(error.response.message);
    }
    mutate();
    toast.success('Invite declined successfully');
  };

  return (
    <div className="bg-light-dark shadow-light space-y-4 rounded-lg transition-all sm:p-6">
      <div className="flex items-center justify-between border-b border-dashed border-gray-700 pb-4">
        <div className="block">
          <h4 className="text-lg  text-slate-200">
            Convidou você para entrar no time:{' '}
            <span className="font-bold">{invite.team.name}</span>
          </h4>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          onClick={declineInviteHandler}
          className="mr-4"
          shape="rounded"
          color="danger"
          size="small"
        >
          Decline
        </Button>
        <Button
          onClick={acceptInviteHandler}
          shape="rounded"
          color="success"
          size="small"
        >
          Accept
        </Button>
      </div>
    </div>
  );
};
