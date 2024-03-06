import { RegisterButton } from '../../atoms/register-button';
import { Skeleton } from '../../skeleton';
import { useTournament } from '@/contexts/tournament';
import { Tournament } from '@/lib/models';
import { getStatus, TournamentStatusOptions } from '@/lib/models/Tournament';
import clsx from 'clsx';
import { CheckCircle2 } from 'lucide-react';
import moment from 'moment';
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
    if (status === 'In progress') {
      return (
        <div className="text-center text-amber-500">
          🚀 <span className="pl-2">In progress...</span>
        </div>
      );
    }

    return <RegisterButton isRegistered={isRegistered} className="w-full" />;
  };

  const phases = ['running', 'registering', 'announced'];

  return (
    <div className="pr-8">
      <div className="bg-light-dark space-y-2">
        <div className="bg-medium-dark">
          <div className="border-border border-b p-4">
            <h4 className="leading-2 text-title font-extrabold">
              Tournament Phases
            </h4>
          </div>
        </div>
        <div className="block p-6">
          <ol className="relative">
            <div className="bg-border absolute -left-1 top-0 h-[100%] w-[1px] rounded"></div>

            <li className="relative pb-4 pl-6">
              <div
                className={clsx(
                  'absolute -left-1 top-0 h-[100%] w-[1px] rounded',
                  phases.includes(tournament.status)
                    ? 'bg-amber-500'
                    : 'bg-border'
                )}
              ></div>
              <div className="absolute -left-3.5 mt-3.5 rounded-full">
                <CheckCircle2
                  className={clsx(
                    'text-dark h-5 w-5 rounded-full bg-amber-500'
                  )}
                />
              </div>
              <time className="text-body mb-1 text-sm leading-none">
                Closes at {moment(tournament.start_date).format('MMM Do')}{' '}
              </time>

              <h3 className="-mb-1 font-semibold text-gray-900 dark:text-white">
                <div className="flex items-center">
                  <span>Registration Open</span>
                </div>
              </h3>
            </li>
            <li className="relative my-4 pl-6">
              {/* <div className="absolute -left-1 top-0 h-[100%] w-2 rounded bg-amber-500"></div> */}
              <div className="absolute -left-3.5 mt-3.5 rounded-full">
                <CheckCircle2 className="bg-background text-muted h-5 w-5 rounded-full" />
              </div>
              <time className="text-body mb-1 text-sm leading-none">
                Closes at {moment(tournament.start_date).format('MMM Do')}{' '}
              </time>
              <h3 className="-mb-1 font-semibold text-gray-900 dark:text-white">
                <span>Tracking results</span>
              </h3>
            </li>
          </ol>
        </div>

        <div className="border-border block border-t border-dashed p-5">
          {renderButton()}
        </div>
      </div>
    </div>
  );
};
