import { RegisterButton } from '../../atoms/register-button';
import TournamentTabPanels from '../../organisms/tournament-tab-panels/tournament-tab-panels';
import TournamentDetailsHeadline from '@/components/ui/molecules/tournament-details-headline';
import TournamentStatusStepper from '@/components/ui/organisms/tournament-status-stepper';
import {
  getStatus,
  getStatusStep,
  Registration,
  Tournament,
} from '@/lib/models';
import { GameID } from '@/pages/[platform]/[game]/tournaments/[id]';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { UsersIcon } from 'lucide-react';
import { FC } from 'react';

type TournamentDetailsTemplateProps = {
  tournament: Tournament;
  gameIds: GameID[];
  participantCheckedInStatus?: boolean;
  registrations: Registration[];
  isRegistered: boolean;
};

const TournamentDetailsTemplate: FC<TournamentDetailsTemplateProps> = ({
  tournament,
  isRegistered,
  gameIds,
  participantCheckedInStatus,
  registrations,
}) => {
  const gameId =
    (gameIds.length > 0 &&
      gameIds.find((gameId) => gameId.game === 'league-of-legends')) ||
    undefined;

  const currentRegistration = registrations.find(
    (registration) => registration.tournament === tournament.id
  );

  const steps = getStatusStep(tournament);

  return (
    <div className="mx-auto px-8 pt-8">
      {/* connect account */}
      {/* {!gameId && <ConnectAccountButton />} */}
      <TournamentDetailsHeadline
        connectedGameId={gameId}
        tournament={tournament}
        registration={currentRegistration}
        isCheckedIn={participantCheckedInStatus}
      />
      {/* <TournamentDetailsTabPanels tournament={tournament} /> */}
      <div className="mt-8 flex space-x-8">
        <div className="lg:w-[300px]">
          <div className="bg-medium-dark shadow-card col-span-1 space-y-4 rounded p-4">
            <span className="text-title font-extrabold uppercase">
              Tournament status
            </span>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-brand">{getStatus(tournament)}</span>
                <div className="text-xs text-gray-500">
                  step {steps[0]} / {steps[1]}
                </div>
              </div>
              <TournamentStatusStepper
                steps={steps[1]}
                currentStep={steps[0]}
              />
              <div className="">
                <div className="text-title flex items-center">
                  <div className="font-title text-xl">
                    {tournament.total_participants / tournament.team_size}/32
                  </div>
                  <UsersIcon className="ml-2 h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center py-3 text-center text-amber-500">
              {isRegistered ? (
                <>
                  <CheckCircledIcon className="mr-2 h-4 w-4" />
                  <p>Registered</p>
                </>
              ) : (
                <RegisterButton
                  className="w-full"
                  isRegistered={isRegistered}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-1">
          <TournamentTabPanels tournament={tournament} />
        </div>
      </div>
    </div>
  );
};

export default TournamentDetailsTemplate;
