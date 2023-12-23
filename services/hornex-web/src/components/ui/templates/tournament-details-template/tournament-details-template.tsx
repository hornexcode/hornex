import TournamentPhasesWidget from '@/components/ui/molecules/tournament-phases-widget';
import TournamentDetailsHeadline from '@/components/ui/organisms/tournament-details-headline';
import TournamentOverviewTabPanel from '@/components/ui/organisms/tournament-overview-tab-panel/tournament-overview-tab-panel';
import TournamentScoringTabPanel from '@/components/ui/organisms/tournament-scoring-tab-panel';
import TournamentStandingTabPanel from '@/components/ui/organisms/tournament-standing-tab-panel';
import { Tournament } from '@/lib/hx-app/types';
import { Tab } from '@headlessui/react';
import classnames from 'classnames';
import { FC, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Button from '../../atoms/button/button';

type TournamentProps = {
  tournament: Tournament;
};

const TournamentDetailsTemplate: FC<TournamentProps> = ({ tournament }) => {
  let [tabs] = useState({
    Overview: '',
    Standings: '',
    'Prize Pool': '',
    Scoring: '',
    Rules: '',
  });

  const { toast } = useToast();

  return (
    <div className="p-6">
      <div className="mb-4 block lg:mb-10">
        <TournamentDetailsHeadline tournament={tournament} />
      </div>
      <Tab.Group>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <Tab.List className="no-scrollbar flex gap-4 overflow-auto border-b border-gray-500 py-1 sm:overflow-visible md:gap-10">
              {Object.keys(tabs).map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    classnames(
                      'font-display text-body -mb-1.5 whitespace-nowrap border-b-2 border-transparent py-4 text-xs font-medium uppercase tracking-wide outline-none transition-colors hover:text-white',
                      selected ? ' border-white !text-white' : 'text-body'
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
              <Tab.Panel>
                <TournamentScoringTabPanel tournament={tournament} />
              </Tab.Panel>
              <Tab.Panel>
                <TournamentScoringTabPanel tournament={tournament} />
              </Tab.Panel>
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

export default TournamentDetailsTemplate;
