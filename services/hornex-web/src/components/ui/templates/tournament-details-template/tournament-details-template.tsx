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
import Image from 'next/image';

import LeagueOfLegendsLogoMarkBlack from '@/assets/images/games/league-of-legends/logomark-black.png';
import { useModal } from '@/components/modal-views/context';
import { GameID } from '@/pages/[platform]/[game]/tournaments/[id]';
import { ConnectedGameId } from '../../molecules/connected-game-id';

type TournamentProps = {
  tournament: Tournament;
  gameIds: GameID[];
};

const TournamentDetailsTemplate: FC<TournamentProps> = ({
  tournament,
  gameIds,
}) => {
  let [tabs] = useState({
    Overview: '',
    Standings: '',
    'Prize Pool': '',
    Scoring: '',
    Rules: '',
  });

  const { toast } = useToast();
  const { openModal } = useModal();

  const gameId =
    (gameIds.length > 0 &&
      gameIds.find((gameId) => gameId.game === 'league-of-legends')) ||
    undefined;

  return (
    <div className="p-6">
      {/* connect account */}
      {!gameId && (
        <div className="bg-light-dark shadow-card mb-4 p-6">
          <h2 className="text-title text-lg font-bold">Connect your account</h2>
          <p className="text-title text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio,
            nostrum!
          </p>
          <div className="pt-6">
            <Button
              shape="rounded"
              size="small"
              onClick={() => openModal('CONNECT_ACCOUNT_VIEW')}
            >
              <div className="flex items-center">
                <Image
                  alt="League of Legends Logo"
                  src={LeagueOfLegendsLogoMarkBlack}
                  width={20}
                  height={20}
                  className="mr-4"
                />
                <span>Connect account</span>
              </div>
            </Button>
          </div>
        </div>
      )}

      {/* tournament details */}
      <div className="mb-4 block lg:mb-10">
        <TournamentDetailsHeadline
          connectedGameId={gameId}
          tournament={tournament}
        />
      </div>
      <Tab.Group>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <Tab.List className="no-scrollbar flex gap-4 overflow-auto border-b border-gray-700 py-1 sm:overflow-visible md:gap-10">
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
        </div>
      </Tab.Group>
    </div>
  );
};

export default TournamentDetailsTemplate;
