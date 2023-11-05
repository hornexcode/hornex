import { InvitesListTabPanel } from '@/components/ui/organisms/invites-list-tab-panel';
import { TeamsListTabPanel } from '@/components/ui/organisms/teams-list-tab-panel';
import { Invite, Team } from '@/lib/hx-app/types';
import { Tab } from '@headlessui/react';
import classnames from 'classnames';
import { FC, useState } from 'react';

type TeamsPageProps = {
  teams: Team[];
  invites: Invite[];
};

const TeamsPage: FC<TeamsPageProps> = ({ teams, invites }) => {
  let [tabs] = useState({
    Teams: '',
    Invites: '',
  });
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
            className={({ selected }) =>
              classnames(
                'relative -mb-1.5 whitespace-nowrap border-b-2 border-transparent py-4 text-sm uppercase tracking-wide text-slate-400 outline-none transition-colors hover:text-white',
                selected ? ' border-white !text-white' : 'text-slate-400'
              )
            }
          >
            Invites
            <div className="relative -top-1 right-1 inline-flex h-3 w-3 rounded-full border-2 border-white bg-red-500 dark:border-gray-900"></div>
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

export default TeamsPage;
