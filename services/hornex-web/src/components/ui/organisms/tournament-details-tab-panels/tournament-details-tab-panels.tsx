import { TournamentPhasesWidget } from '../../molecules';
import { TournamentOverviewTabPanel } from './tournament-overview-tab-panel';
import { TournamentStandingTabPanel } from './tournament-standing-tab-panel';
import { Tournament } from '@/lib/models';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { useState } from 'react';

type TournamentDetailsTabPanelsProps = {
  tournament: Tournament;
};

const TournamentDetailsTabPanels = ({
  tournament,
}: TournamentDetailsTabPanelsProps) => {
  let [tabs] = useState({
    Overview: '',
    Standings: '',
    'Prize Pool': '',
    Brackets: '',
    Rules: '',
  });

  return (
    <div className="py-4">
      <Tab.Group>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <Tab.List className="no-scrollbar flex gap-4 overflow-auto border-b border-zinc-700 py-1 sm:overflow-visible md:gap-10">
              {Object.keys(tabs).map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    clsx(
                      'text-title -mb-1.5 whitespace-nowrap border-b-2 border-transparent py-4 text-sm font-medium tracking-wide outline-none transition-colors hover:text-white',
                      selected ? ' border-white ' : 'text-title'
                    )
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>
          </div>
          <div className="col-span-3">
            <TournamentPhasesWidget tournament={tournament} />
          </div>
          <div className="col-span-9">
            <Tab.Panels>
              <Tab.Panel>
                <TournamentOverviewTabPanel tournament={tournament} />
              </Tab.Panel>
              <Tab.Panel>
                <TournamentStandingTabPanel tournament={tournament} />
              </Tab.Panel>
              <Tab.Panel></Tab.Panel>
              <Tab.Panel>
                <div className="bg-light-dark">
                  <iframe
                    src={`${tournament.challonge_tournament_url}/module?show_live_status=0`}
                    width="100%"
                    height="600"
                    frameBorder={0}
                    scrolling="auto"
                    // allowTransparency={true}
                  ></iframe>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </div>
        </div>
      </Tab.Group>
    </div>
  );
};

export default TournamentDetailsTabPanels;
