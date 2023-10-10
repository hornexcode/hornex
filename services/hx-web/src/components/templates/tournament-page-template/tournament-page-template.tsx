import TournamentPhasesWidget from '@/components/molecules/tournament-phases-widget';
import TournamentHeadline from '@/components/organisms/tournament-headline';
import { TournamentTabs } from '@/components/tournaments/tournament-tabs';
import Button from '@/components/ui/button/button';
import { SwordsIcon } from '@/components/ui/icons';
import { Tournament } from '@/lib/hx-app/types';
import { calcPrizePool, toCurrency } from '@/lib/utils';
import { Tab } from '@headlessui/react';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  SwatchIcon,
  TrophyIcon,
} from '@heroicons/react/20/solid';
import classnames from 'classnames';
import { UsersIcon } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import { FC, useState } from 'react';

type TournamentPageTemplateProps = {
  tournament: Tournament;
};

const TournamentPageTemplate: FC<TournamentPageTemplateProps> = ({
  tournament,
}) => {
  let [tabs] = useState({
    Overview: '',
    Prizes: '<Prizes />',
    'How it works': '',
    Teams: '',
    Rules: '',
  });
  return (
    <div className="p-6">
      <div className="mb-4 block lg:mb-10">
        <TournamentHeadline tournament={tournament} />
      </div>
      <Tab.Group>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <Tab.List className="no-scrollbar flex gap-4 overflow-auto border-b border-slate-800 py-1 sm:overflow-visible md:gap-10">
              {Object.keys(tabs).map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    classnames(
                      '-mb-1.5 whitespace-nowrap py-4 text-sm tracking-wide text-slate-400 outline-none transition-colors hover:text-white',
                      selected
                        ? 'border-b-2 border-white font-semibold !text-white'
                        : 'text-slate-400'
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
              {Object.values(tabs).map((component, idx) => (
                <Tab.Panel key={idx}>{component}</Tab.Panel>
              ))}
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
