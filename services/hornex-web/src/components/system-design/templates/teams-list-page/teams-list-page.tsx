import { InvitesListTabPanel } from '@/components/system-design/organisms/invites-list-tab-panel';
import { TeamsListTabPanel } from '@/components/system-design/organisms/teams-list-tab-panel';
import { Invite, Team } from '@/lib/hx-app/types';
import { Tab } from '@headlessui/react';
import classnames from 'classnames';
import { FC, useState } from 'react';

type TeamsListPageProps = {
  teams: Team[];
  invites: Invite[];
};

const TeamsListPage: FC<TeamsListPageProps> = ({ teams, invites }) => {
  let [tabs] = useState({
    Teams: '',
    Invites: '',
  });
  return (
    <div className="p-6">
      <Tab.Group>
        <Tab.List className="no-scrollbar flex gap-4 overflow-auto border-b-2 border-slate-800 py-1 sm:overflow-visible md:gap-10">
          {Object.keys(tabs).map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classnames(
                  '-mb-1.5 whitespace-nowrap border-b-2 border-transparent py-4 text-sm uppercase tracking-wide text-slate-400 outline-none transition-colors hover:text-white',
                  selected ? ' border-white !text-white' : 'text-slate-400'
                )
              }
            >
              {tab}
            </Tab>
          ))}
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

export default TeamsListPage;
