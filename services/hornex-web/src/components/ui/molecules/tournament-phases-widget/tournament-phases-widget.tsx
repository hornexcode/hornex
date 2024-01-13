import { useModal } from '@/components/modal-views/context';
import Button from '@/components/ui/atoms/button/button';
import { Tournament } from '@/lib/models';
import classnames from 'classnames';
import {
  ArrowBigRightDash,
  ArrowRightToLineIcon,
  CheckCircle2,
  UsersIcon,
} from 'lucide-react';
import moment from 'moment';
import { FC } from 'react';

type TournamentPhasesWidgetProps = {
  tournament: Tournament;
};

export const TournamentPhasesWidget: FC<TournamentPhasesWidgetProps> = ({
  tournament,
}) => {
  const { openModal } = useModal();

  return (
    <div className="bg-light-dark shadow-card space-y-2 rounded-md ">
      <div className="bg-medium-dark highlight-white-5 rounded-t">
        <div className="border-b border-gray-700 p-4">
          <h4 className="leading-2 text-title text-sm font-extrabold">
            Tournament Phases
          </h4>
        </div>
      </div>
      <div className="block p-5">
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
          <div className="absolute -left-1 top-0 h-[100%] w-[4px] rounded bg-slate-700"></div>
          <div className="absolute -left-1 top-0 h-[66%] w-[4px] rounded bg-amber-500"></div>

          <li className="mb-10 pl-4">
            {/* <div className="dark:border-light-dark absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-gray-200 dark:bg-amber-400"></div> */}
            <div className="absolute -left-2.5 mt-3.5 rounded-full">
              <CheckCircle2 className="text-dark h-4 w-4 rounded-full bg-amber-500" />
            </div>
            <time className="text-body mb-1 text-xs font-normal leading-none">
              Closes at {moment(tournament.start_date).format('MMM Do')}{' '}
              {/* <ArrowRightToLineIcon className="mx-2 w-4 text-slate-400" />{' '}
              {moment(tournament.end_date).format('MMM Do')} */}
            </time>

            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              Registration Open
            </h3>
            {/* <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
              Register your team so you can get paid to play.
            </p> */}

            <div className="mb-4 block space-y-2">
              <div className="col-span-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <UsersIcon className="mr-1 h-5 w-4 " />
                    <span className="pr-4 text-xs font-bold text-white">
                      {tournament.teams.length} / {tournament.max_teams}
                    </span>
                  </div>
                </div>
              </div>
              {/* <div className="col-span-2">
                <div className={classnames('flex w-full')}>
                  {Array.from({ length: tournament.max_teams }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className={classnames(
                          'flex-basis mr-1 h-2 flex-grow rounded-[2px]  bg-amber-400',
                          {
                            'bg-gray-600': index > tournament.teams.length - 1,
                          }
                        )}
                      ></div>
                    )
                  )}
                </div>
              </div> */}
            </div>
          </li>
          <li className="mb-10 ml-4">
            {/* <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div> */}
            <div className="absolute -left-2.5 mt-3.5 rounded-full">
              <CheckCircle2 className="text-dark h-4 w-4 rounded-full bg-amber-500" />
            </div>
            <time className="text-body mb-1 text-xs font-normal leading-none">
              to be defined
            </time>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Results tracking
            </h3>
            {/* <p className="text-xs font-normal text-gray-500 dark:text-gray-400">
              Coleta de dados
            </p> */}
          </li>
          <li className="mb-10 ml-4">
            {/* <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div> */}
            <div className="absolute -left-2.5 mt-3.5 rounded-full">
              <CheckCircle2 className="text-dark h-4 w-4 rounded-full bg-amber-500" />
            </div>
            <time className="text-body mb-1 text-xs font-normal leading-none">
              to be defined
            </time>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Payment
            </h3>
          </li>
          <li className="ml-4">
            <div className="absolute -left-2.5 mt-3.5 rounded-full">
              <CheckCircle2 className="h-4 w-4 rounded-full bg-slate-600 text-slate-200" />
            </div>
            <time className="text-body mb-1 text-xs font-normal leading-none">
              to be defined
            </time>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Paid
            </h3>
          </li>
        </ol>
      </div>

      <div className="block border-t border-dashed border-gray-600 p-5">
        <Button
          onClick={() => openModal(`REGISTRATION_VIEW`)}
          color="warning"
          size="small"
          fullWidth
          shape="rounded"
        >
          Registrar time
        </Button>
      </div>
    </div>
  );
};
