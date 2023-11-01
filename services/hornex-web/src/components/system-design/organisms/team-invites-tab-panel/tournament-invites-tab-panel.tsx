import { TeamInvitesList } from '../team-invites-list';
import { Invite } from '@/lib/hx-app/types';
import { FC } from 'react';

type TeamInvitesTabPanelProps = {
  invites: Invite[];
};

export const TeamInvitesTabPanel: FC<TeamInvitesTabPanelProps> = ({
  invites,
}) => {
  return (
    <div className="mx-auto h-full space-y-8">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white  sm:text-2xl">
          Meus convites
        </h2>
      </div>

      <div className="h-[100vh]">
        <div id="teams" className="">
          <div className="grid gap-5">
            {invites && <TeamInvitesList invites={invites} />}
          </div>
        </div>
      </div>
    </div>
  );
};
