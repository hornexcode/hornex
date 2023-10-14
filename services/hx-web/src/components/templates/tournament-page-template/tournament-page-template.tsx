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
import { UserIcon } from 'lucide-react';
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
    Prizes: '',
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
                <div className="box">
                  <div className="block space-y-8">
                    <div className="block">
                      <div className="text-heading-style mb-2 uppercase text-white">
                        Informações Gerais
                      </div>
                      <p className="text-sm">{tournament.description}</p>
                    </div>
                    <div className="block">
                      <div className="text-heading-style mb-2 uppercase text-white">
                        Format
                      </div>
                      <span className="bg-light-dark rounded-full px-4 py-2 text-sm font-semibold">
                        Single elimination
                      </span>
                    </div>
                    <div className="block">
                      <div className="text-heading-style mb-2 uppercase text-white">
                        Potential Prize Pool
                      </div>
                      <div className="text-base text-white">
                        R$
                        {calcPrizePool(
                          tournament.entry_fee,
                          tournament.team_size * tournament.max_teams,
                          0.7
                        )}
                      </div>
                    </div>
                    <div className="block">
                      <div className="text-xs font-semibold">Team Size</div>
                      <div className="text-base text-white">
                        {tournament.team_size}
                      </div>
                    </div>
                    <div className="block">
                      <div className="text-xs font-semibold">Max Teams</div>
                      <div className="text-base text-white">
                        {tournament.max_teams}
                      </div>
                    </div>
                    <div className="block">
                      <div className="text-xs font-semibold">Game</div>
                      <div className="text-base text-white">
                        {tournament.game}
                      </div>
                    </div>
                    <div className="block">
                      <div className="text-xs font-semibold">Platform</div>
                      <div className="text-base text-white">
                        {tournament.platform}
                      </div>
                    </div>
                    <div className="block">
                      <div className="text-xs font-semibold">Organizer</div>
                      <div className="text-base text-white">
                        <UserIcon className="w-4" />
                        {tournament.organizer}
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>Prizes</Tab.Panel>
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
