import { ConnectAccountButton } from '../../atoms/connect-account-button';
import { TournamentPhasesWidget } from '../../molecules';
import TournamentTabPanels from '../../organisms/tournament-tab-panels/tournament-tab-panels';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import TournamentDetailsHeadline from '@/components/ui/molecules/tournament-details-headline';
import { useTournament } from '@/contexts';
import { getStatusStep } from '@/lib/models/Tournament';
import { FC } from 'react';

type TournamentDetailsTemplateProps = {
  participantCheckedInStatus?: boolean;
};

const TournamentDetailsTemplate: FC<TournamentDetailsTemplateProps> = ({}) => {
  const { tournament, isRegistered } = useTournament();

  return (
    <div className="mx-auto px-8 pt-8">
      {/* breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/compete">Compete</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tournament.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* connect account */}
      {!false && <ConnectAccountButton />}

      {/* headline */}
      <TournamentDetailsHeadline isCheckedIn={false} />

      <div className="mt-8 flex space-x-8">
        <div className="lg:w-[280px]">
          <TournamentPhasesWidget
            tournament={tournament}
            isRegistered={isRegistered}
          />
          {/* <div className="bg-medium-dark col-span-1 space-y-2">
            <div className="px-4 pt-4">
              <span className="text-muted">Tournament status</span>
            </div>
            <div className="space-y-2 px-4 pb-4">
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
            </div>
            <div className="border-border flex items-center justify-center border-t border-dashed p-4 text-center text-amber-500">
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
          </div> */}
        </div>
        <div className="flex flex-1">
          <TournamentTabPanels tournament={tournament} />
        </div>
      </div>
    </div>
  );
};

export default TournamentDetailsTemplate;
