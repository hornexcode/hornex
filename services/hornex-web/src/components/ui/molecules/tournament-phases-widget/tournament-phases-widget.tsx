import { RegisterButton } from '../../atoms/register-button';
import TournamentRegistrationStateProgress from '../tournament-registration-state-progress';
import { Tournament } from '@/lib/models';
import { cn } from '@/lib/utils';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { CircleDot } from 'lucide-react';
import React, { FC } from 'react';

type TournamentPhasesWidgetProps = {
  tournament: Tournament;
  isRegistered: boolean;
};

export const TournamentPhasesWidget: FC<TournamentPhasesWidgetProps> = ({
  tournament,
  isRegistered,
}) => {
  const renderButton = () => {
    if (tournament.status === 'ended') {
      return (
        <div className="text-muted mt-6 text-center font-semibold">
          <span className="pl-2">Ended</span>
        </div>
      );
    }

    if (isRegistered) {
      return (
        <div className="text-brand flex items-center justify-center pt-6 font-bold">
          <CheckCircledIcon className="mr-2 h-4 w-4" />
          Registered
        </div>
      );
    }

    return (
      <RegisterButton isRegistered={isRegistered} className="mt-6 w-full" />
    );
  };

  const getTournamentStep = () => {
    switch (tournament.status) {
      case 'registering':
        return 1;
      case 'running':
        return 2;
      case 'ended':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-medium-dark border-border space-y-2 rounded border p-6">
      <div className="border-border border-b border-dashed pb-4">
        <h4 className="leading-2 text-title text-lg font-bold">
          Tournament Phases
        </h4>
        <p className="text-body">Keep track of tournament state</p>
      </div>
      <div className="block py-4">
        <div>
          <div className="flex items-center">
            <CircleDot
              className={cn(
                'text-muted mr-2 w-6',
                getTournamentStep() >= 1 && 'text-green-400'
              )}
            />
            <span className="text-title font-medium">Registration Open</span>
          </div>
          <div className="p-2 px-2.5">
            <div className="border-border h-6 w-full border-l-2"></div>
          </div>
          <div className="flex items-center">
            <CircleDot
              className={cn(
                'text-muted mr-2 w-6',
                getTournamentStep() >= 2 && 'text-green-400'
              )}
            />
            <span className="text-title font-medium">In Progress</span>
          </div>
          <div className="p-2 px-2.5">
            <div className="border-border h-6 w-full border-l-2"></div>
          </div>
          <div className="flex items-center">
            <CircleDot
              className={cn(
                'text-muted mr-2 w-6',
                getTournamentStep() >= 3 && 'text-green-400'
              )}
            />
            <span className="text-title font-medium">Finished</span>
          </div>
        </div>
      </div>

      <div className="border-border justify-center border-t border-dashed pt-4">
        <TournamentRegistrationStateProgress tournament={tournament} />
        {tournament.status == 'registering' && renderButton()}
      </div>
    </div>
  );
};
