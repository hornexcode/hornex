import {
  HowItWorks,
  Overview,
  Prizes,
  Rules,
  Teams,
} from '@/components/tournaments/tournament-tabs';
import { Tab } from '@headlessui/react';
import { useState } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function TournamentTabs() {
  let [tabs] = useState({
    Overview: <Overview />,
    Prizes: <Prizes />,
    'How it works': <HowItWorks />,
    Teams: <Teams />,
    Rules: <Rules />,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <Tab.Group>
        <Tab.List className="no-scrollbar flex gap-4 overflow-auto border-b border-slate-800 py-1 sm:overflow-visible md:gap-10">
          {Object.keys(tabs).map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  'font-display -mb-1.5 whitespace-nowrap py-4 text-sm uppercase tracking-wider text-slate-400 outline-none transition-colors hover:text-white',
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
        <Tab.Panels>
          {Object.values(tabs).map((component, idx) => (
            <Tab.Panel key={idx}>{component}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
