import { InvitesListTabPanel } from '@/components/ui/organisms/invites-list-tab-panel';
import { TeamsListTabPanel } from '@/components/ui/organisms/teams-list-tab-panel';
import { Invite, Team } from '@/lib/models/types';
import { GetNotificationsResponse } from '@/lib/models/types/rest/get-notifications';
import { dataLoader } from '@/lib/request';
import { Tab } from '@headlessui/react';
import classnames from 'classnames';
import { FC, useCallback, useState } from 'react';

type TeamsListTemplateProps = {
  teams: Team[];
  invites: Invite[];
};

const { useData: useGetNotifications } =
  dataLoader<GetNotificationsResponse>('getNotifications');

const { submit: readNotifications } = dataLoader<undefined, string[]>(
  'readNotifications'
);

const TeamsListTemplate: FC<TeamsListTemplateProps> = ({ teams, invites }) => {
  let [tabs] = useState({
    Teams: '',
    Invites: '',
  });

  const { data: notifications, mutate } = useGetNotifications({
    activity: 'team_invitation',
  });

  const refreshNotificationPin = useCallback(async () => {
    await readNotifications(
      {},
      notifications?.map((notification) => notification.id)
    );

    mutate();
  }, [mutate, notifications]);

  return (
    <div className="p-6">
      <Tab.Group>
        <Tab.List className="no-scrollbar flex gap-4 overflow-auto border-b-2 border-slate-800 py-1 sm:overflow-visible md:gap-10">
          <Tab
            className={({ selected }) =>
              classnames(
                '-mb-1.5 whitespace-nowrap border-b-2 border-transparent py-4 text-sm uppercase tracking-wide text-slate-400 outline-none transition-colors hover:text-white',
                selected ? ' border-white !text-white' : 'text-slate-400'
              )
            }
          >
            Teams
          </Tab>
          <Tab
            onClick={() => refreshNotificationPin()}
            className={({ selected }) =>
              classnames(
                'relative -mb-1.5 whitespace-nowrap border-b-2 border-transparent py-4 text-sm uppercase tracking-wide text-slate-400 outline-none transition-colors hover:text-white',
                selected ? ' border-white !text-white' : 'text-slate-400'
              )
            }
          >
            Invites
            {notifications &&
              notifications.find(
                (notification) => notification.read_at === null
              ) && (
                <div className="relative -top-1 right-1 inline-flex h-3 w-3 rounded-full border-2 border-white bg-red-500 dark:border-gray-900"></div>
              )}
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <TeamsListTabPanel teams={teams} />
          </Tab.Panel>
          <Tab.Panel>
            <InvitesListTabPanel invites={invites} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default TeamsListTemplate;
