import Button from '../../atoms/button/button';
import LeagueOfLegendsLogoMarkBlack from '@/assets/images/games/league-of-legends/logomark-black.png';
import { useModal } from '@/components/modal-views/context';
import { TournamentPhasesWidget } from '@/components/ui/molecules';
import TournamentDetailsHeadline from '@/components/ui/organisms/tournament-details-headline';
import TournamentOverviewTabPanel from '@/components/ui/organisms/tournament-overview-tab-panel/tournament-overview-tab-panel';
import TournamentScoringTabPanel from '@/components/ui/organisms/tournament-scoring-tab-panel';
import TournamentStandingTabPanel from '@/components/ui/organisms/tournament-standing-tab-panel';
import { useToast } from '@/components/ui/use-toast';
import { Registration, Tournament } from '@/lib/models';
import { toCurrency } from '@/lib/utils';
import { GameID } from '@/pages/[platform]/[game]/tournaments/[id]';
import { Tab } from '@headlessui/react';
import { TrophyIcon } from '@heroicons/react/20/solid';
import classnames from 'classnames';
import Image from 'next/image';
import { FC, useState } from 'react';

type TournamentDetailsTemplateProps = {
  tournament: Tournament;
  gameIds: GameID[];
  registrations: Registration[];
};

const TournamentDetailsTemplate: FC<TournamentDetailsTemplateProps> = ({
  tournament,
  gameIds,
  registrations,
}) => {
  let [tabs] = useState({
    Overview: '',
    Standings: '',
    'Prize Pool': '',
    Brackets: '',
    Rules: '',
  });

  const { toast } = useToast();
  const { openModal } = useModal();

  const gameId =
    (gameIds.length > 0 &&
      gameIds.find((gameId) => gameId.game === 'league-of-legends')) ||
    undefined;

  // TODO: create a new endpoint to check if user is registered
  const isRegistrated = registrations.some(
    (registration) => registration.tournament === tournament.id
  );

  return (
    <div className="p-8">
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
          isRegistrated={isRegistrated}
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
                      'font-display text-body -mb-1.5 whitespace-nowrap border-b-2 border-transparent py-4 text-sm font-medium uppercase tracking-wide outline-none transition-colors hover:text-white',
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
                <div className="grid grid-cols-2 gap-8">
                  <div className="col-span-1">
                    <div className="bg-medium-dark highlight-white-5 shadow-button l-0 relative flex items-center rounded p-4 bg-blend-hard-light">
                      <div className="absolute right-0 h-2/3 w-2 bg-gray-200"></div>
                      <div className="highlight-white-20 shadow-card rounded bg-gray-200 p-4">
                        <TrophyIcon className="text-dark h-7 w-7" />
                      </div>
                      <div className="flex flex-col px-4">
                        <h4 className="text-title text-sm font-light tracking-wide">
                          Potential Prize Pool
                        </h4>
                        <div className="text-title font-display text-xl font-extrabold ">
                          R${' '}
                          <span className="">
                            {toCurrency(
                              tournament.team_size *
                                tournament.max_teams *
                                tournament.entry_fee *
                                0.7
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <p className="text-lg font-light text-gray-400">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quia odit labore nihil laudantium officia iure esse
                      deleniti sunt distinctio nostrum!
                    </p>
                  </div>
                </div>

                <div className="flex-space-y-4 mt-4">
                  <div className="bg-medium-dark highlight-white-5 shadow-button l-0 relative flex items-center rounded p-4 bg-blend-hard-light">
                    <div className="absolute right-0 h-2/3 w-1 bg-amber-400"></div>
                    <div className="highlight-white-20 shadow-card h-10 w-10 rounded bg-amber-400 text-center ">
                      <span className="text-dark text-4xl font-extrabold">
                        1
                      </span>
                    </div>
                    <div className="flex flex-col px-4">
                      <h4 className="text-body text-sm font-bold tracking-wide">
                        st
                      </h4>
                      <div className="text-title font-display text-xl font-extrabold ">
                        R$ <span className="">28.00</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-space-y-4 mt-1">
                  <div className="bg-medium-dark/80 highlight-white-5 shadow-button l-0 relative flex items-center rounded p-4 bg-blend-hard-light">
                    <div className="absolute right-0 h-2/3 w-1 bg-cyan-400"></div>
                    <div className="highlight-white-20 shadow-card font-display h-10 w-10 rounded bg-cyan-400 text-center">
                      <span className="text-dark text-4xl font-extrabold">
                        2
                      </span>
                    </div>
                    <div className="flex flex-col px-4">
                      <h4 className="text-body text-sm font-bold tracking-wide">
                        nd
                      </h4>
                      <div className="text-title font-display text-xl font-extrabold ">
                        R$ <span className="">12.00</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-space-y-4 mt-1">
                  <div className="bg-medium-dark/60 highlight-white-5 shadow-button l-0 relative flex items-center rounded p-4 bg-blend-hard-light">
                    <div className="absolute right-0 h-2/3 w-1 bg-green-400"></div>
                    <div className="highlight-white-20 shadow-card font-display h-10 w-10 rounded bg-green-400 text-center">
                      <span className="text-dark text-4xl font-extrabold">
                        3
                      </span>
                    </div>
                    <div className="flex flex-col px-4">
                      <h4 className="text-body text-sm font-bold tracking-wide">
                        rd
                      </h4>
                      <div className="text-title font-display text-xl font-extrabold ">
                        R$ <span className="">8.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="bg-light-dark">
                  <iframe
                    src="https://challonge.com/quz6flp4/module?show_live_status=0"
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
          <div className="col-span-3">
            <TournamentPhasesWidget tournament={tournament} />
          </div>
        </div>
      </Tab.Group>
    </div>
  );
};

export default TournamentDetailsTemplate;
