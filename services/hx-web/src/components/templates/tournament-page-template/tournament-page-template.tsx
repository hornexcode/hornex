import TournamentPhasesWidget from '@/components/molecules/tournament-phases-widget';
import TournamentDetailsHeadline from '@/components/organisms/tournament-details-headline';
import TournamentOverviewTabPanel from '@/components/organisms/tournament-overview-tab-panel/tournament-overview-tab-panel';
import TournamentStandingTabPanel from '@/components/organisms/tournament-standing-tab-panel';
import { Tournament } from '@/lib/hx-app/types';
import { Tab } from '@headlessui/react';
import classnames from 'classnames';
import { FC, useState } from 'react';

type TournamentPageTemplateProps = {
  tournament: Tournament;
};

const TournamentPageTemplate: FC<TournamentPageTemplateProps> = ({
  tournament,
}) => {
  let [tabs] = useState({
    Overview: '',
    Standings: '',
    'Prize Pool': '',
    Scoring: '',
    Rules: '',
  });
  return (
    <div className="p-6">
      <div className="mb-4 block lg:mb-10">
        <TournamentDetailsHeadline tournament={tournament} />
      </div>
      <Tab.Group>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
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
          </div>

          <div className="col-span-9">
            <Tab.Panels>
              <Tab.Panel>
                <TournamentOverviewTabPanel tournament={tournament} />
              </Tab.Panel>
              <Tab.Panel>
                <TournamentStandingTabPanel tournament={tournament} />
              </Tab.Panel>
              <Tab.Panel>How it works</Tab.Panel>
              <Tab.Panel>Teams</Tab.Panel>
            </Tab.Panels>
          </div>
          <div className="col-span-3">
            <TournamentPhasesWidget tournament={tournament} />
          </div>
          {/* <div className="mt-4 grid grid-cols-4 gap-4">
            <div className="col-span-1">
            <TournamentPhasesWidget tournament={tournament} />
            </div>
            <div className="col-span-3">
            <div className="bg-light-dark space-y-8 rounded-md p-4"></div>
            </div>
          </div> */}
        </div>
      </Tab.Group>
    </div>
  );
};

export default TournamentPageTemplate;
