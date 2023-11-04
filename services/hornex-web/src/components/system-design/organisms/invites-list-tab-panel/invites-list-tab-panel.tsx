import { InvitesList } from '../invites-list';
import { Invite } from '@/lib/hx-app/types';
import { FC } from 'react';

type InvitesListTabPanelProps = {
  invites: Invite[];
};

export const InvitesListTabPanel: FC<InvitesListTabPanelProps> = ({
  invites,
}) => {
  return (
    <div className="mx-auto h-full space-y-8">
      <div className="mt-4 h-[100vh]">
        <div id="teams" className="">
          <div className="grid gap-5">
            {invites && <InvitesList invites={invites} />}
          </div>
        </div>
      </div>
    </div>
  );
};
