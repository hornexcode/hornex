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
    <div className="flex w-full flex-col gap-6">
      <Tab.Group>
        <Tab.List className="flex justify-center gap-4 overflow-auto border-b border-slate-800 py-1 no-scrollbar sm:overflow-visible md:gap-10">
          {Object.keys(tabs).map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  'text-md -mb-1.5 whitespace-nowrap px-4 py-4 font-semibold text-slate-400 outline-none transition-colors hover:text-sky-400',
                  selected
                    ? 'border-b-2 border-sky-400 !text-white'
                    : 'text-slate-400',
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
