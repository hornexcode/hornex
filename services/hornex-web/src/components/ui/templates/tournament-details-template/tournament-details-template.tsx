import { ConnectAccountButton } from '../../atoms/connect-account-button';
import { RegisterButton } from '../../atoms/register-button';
import TournamentTabPanels from '../../organisms/tournament-tab-panels/tournament-tab-panels';
import TournamentDetailsHeadline from '@/components/ui/molecules/tournament-details-headline';
import TournamentStatusStepper from '@/components/ui/organisms/tournament-status-stepper';
import { useTournament } from '@/contexts';
import { getStatus, getStatusStep, Registration } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { UsersIcon } from 'lucide-react';
import { FC } from 'react';

const { useData: useGetTournamentRegistrationsQuery } = dataLoader<
  Registration[]
>('getTournamentRegistrations');

type TournamentDetailsTemplateProps = {
  participantCheckedInStatus?: boolean;
};

const TournamentDetailsTemplate: FC<TournamentDetailsTemplateProps> = ({}) => {
  const { tournament, isRegistered } = useTournament();
  const steps = getStatusStep(tournament);

  const { data: registrations } = useGetTournamentRegistrationsQuery({
    uuid: tournament.uuid,
  });

  console.log('registrations', registrations);

  return (
    <div className="mx-auto px-8 pt-8">
      {/* connect account */}
      {/* {!gameId && <ConnectAccountButton />} */}
      <TournamentDetailsHeadline isCheckedIn={false} />
      {/* <TournamentDetailsTabPanels tournament={tournament} /> */}
      <div className="mt-8 flex space-x-8">
        <div className="lg:w-[300px]">
          <div className="bg-medium-dark shadow-card col-span-1 space-y-4 rounded p-4">
            <span className="text-muted">Tournament status</span>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-brand font-source-sans">
                  {getStatus(tournament)}
                </span>
                <div className="text-muted">
                  step {steps[0]} / {steps[1]}
                </div>
              </div>
              <TournamentStatusStepper
                steps={steps[1]}
                currentStep={steps[0]}
              />
              <div className="">
                <div className="text-title font-display flex items-center">
                  {registrations?.length || 0}/{tournament.max_teams}
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
