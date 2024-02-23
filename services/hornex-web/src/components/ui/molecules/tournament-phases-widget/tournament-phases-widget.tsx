import { RegisterButton } from '../../atoms/register-button';
import { Skeleton } from '../../skeleton';
import { useTournament } from '@/contexts/tournament';
import { getStatus, TournamentStatus } from '@/lib/models';
import clsx from 'clsx';
import { CheckCircle2 } from 'lucide-react';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';

type TournamentPhasesWidgetProps = {};

export const TournamentPhasesWidget: FC<TournamentPhasesWidgetProps> = () => {
  const { tournament, isLoading, isRegistered } = useTournament();

  const [status, setStatus] = useState<TournamentStatus>('');

  useEffect(() => {
    setStatus(getStatus(tournament));
  }, [tournament]);

  const renderButton = () => {
    if (isLoading) {
      return <Skeleton className="bg-medium-dark h-[40px] w-full rounded" />;
    }

    if (status === 'In progress') {
      return (
        <div className="text-center text-amber-500">
          🚀 <span className="pl-2">In progress...</span>
        </div>
      );
    }

    return <RegisterButton isRegistered={isRegistered} className="w-full" />;
  };
  return (
    <div className="pr-8">
      <div className="bg-light-dark shadow-card space-y-2 rounded-md">
        <div className="bg-medium-dark highlight-white-5 rounded-t">
          <div className="border-b border-gray-600 p-4">
            <h4 className="leading-2 text-title font-extrabold">
              Tournament Phases
            </h4>
          </div>
        </div>
        <div className="block p-5">
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            <div className="bg-dark absolute -left-1 top-0 h-[100%] w-2 rounded"></div>

            <li className="relative pl-4">
              <div
                className={clsx(
                  'absolute -left-1 top-0 h-[100%] w-2 rounded',
                  status === 'Open' ? 'bg-amber-500' : 'bg-dark'
                )}
              ></div>
              <div className="absolute -left-2 mt-3.5 rounded-full">
                <CheckCircle2
                  className={clsx(
                    'text-dark h-4 w-4 rounded-full bg-amber-500'
                  )}
                />
              </div>
              <time className="text-body mb-1 text-sm leading-none">
                Closes at {moment(tournament.start_date).format('MMM Do')}{' '}
              </time>

              <h3 className="-mb-1  font-semibold text-gray-900 dark:text-white">
                <div className="flex items-center">
                  <span>Registration Open</span>
                </div>
              </h3>
            </li>
            <li className="relative pl-4 pt-10">
              {/* <div className="absolute -left-1 top-0 h-[100%] w-2 rounded bg-amber-500"></div> */}
              <div className="absolute -left-2 mt-3.5 rounded-full">
                <CheckCircle2 className="bg-dark text-light-dark h-4 w-4 rounded-full" />
              </div>
              <time className="text-body mb-1 text-sm leading-none">
                Closes at {moment(tournament.end_date).format('MMM Do')}{' '}
              </time>

              <h3 className="-mb-1 font-semibold text-gray-900 dark:text-white">
                <span>Tracking results</span>
              </h3>
            </li>
            <li className="relative pl-4 pt-10">
              {/* <div className="absolute -left-1 top-0 h-[100%] w-2 rounded bg-amber-500"></div> */}
              <div className="absolute -left-2 mt-3.5 rounded-full">
                <CheckCircle2 className="bg-dark text-light-dark h-4 w-4 rounded-full" />
              </div>
              <time className="text-body mb-1 text-sm leading-none">
                Closes at {moment(tournament.start_date).format('MMM Do')}{' '}
              </time>

              <h3 className="-mb-1 font-semibold text-gray-900 dark:text-white">
                Payment
              </h3>
            </li>
            <li className="relative pl-4 pt-10">
              {/* <div className="absolute -left-1 top-0 h-[100%] w-2 rounded bg-amber-500"></div> */}
              <div className="absolute -left-2 mt-3.5 rounded-full">
                <CheckCircle2 className="bg-dark text-light-dark h-4 w-4 rounded-full" />
              </div>
              <time className="text-body mb-1 text-sm leading-none">
                Closes at {moment(tournament.start_date).format('MMM Do')}{' '}
              </time>

              <h3 className="-mb-1 font-semibold text-gray-900 dark:text-white">
                Done
              </h3>
            </li>
          </ol>
        </div>

        <div className="block border-t border-dashed border-gray-600 p-5">
          {renderButton()}
        </div>
      </div>
    </div>
  );
};
