import { useModal } from '@/components/modal-views/context';
import Button from '@/components/ui/atoms/button/button';
import { Tournament } from '@/lib/models';
import { CheckCircle2, UsersIcon } from 'lucide-react';
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

          <li className="relative pl-4">
            <div className="absolute -left-1 top-0 h-[100%] w-[4px] rounded bg-amber-500"></div>
            <div className="absolute -left-2.5 mt-3.5 rounded-full">
              <CheckCircle2 className="text-dark h-4 w-4 rounded-full bg-amber-500" />
            </div>
            <time className="text-body mb-1 text-xs font-normal leading-none">
              Closes at {moment(tournament.start_date).format('MMM Do')}{' '}
            </time>

            <h3 className="-mb-1 text-sm font-semibold text-gray-900 dark:text-white">
              <div className="flex items-center">
                <span>Registration Open</span>
                <span className="font-display text-body ml-2 text-xs  font-semibold">
                  teams {tournament.teams.length}/{tournament.max_teams}
                </span>
              </div>
            </h3>
          </li>
          <li className="relative pl-4 pt-10">
            {/* <div className="absolute -left-1 top-0 h-[100%] w-[4px] rounded bg-amber-500"></div> */}
            <div className="absolute -left-2.5 mt-3.5 rounded-full">
              <CheckCircle2 className="h-4 w-4 rounded-full bg-slate-700 text-slate-400" />
            </div>
            <time className="text-body mb-1 text-xs font-normal leading-none">
              Closes at {moment(tournament.start_date).format('MMM Do')}{' '}
            </time>

            <h3 className="-mb-1 text-sm font-semibold text-gray-900 dark:text-white">
              <span>Tracking results</span>
              <span className="font-display dark:text-body ml-2 text-xs font-semibold">
                round 0/4
              </span>
            </h3>
          </li>
          <li className="relative pl-4 pt-10">
            {/* <div className="absolute -left-1 top-0 h-[100%] w-[4px] rounded bg-amber-500"></div> */}
            <div className="absolute -left-2.5 mt-3.5 rounded-full">
              <CheckCircle2 className="h-4 w-4 rounded-full bg-slate-700 text-slate-400" />
            </div>
            <time className="text-body mb-1 text-xs font-normal leading-none">
              Closes at {moment(tournament.start_date).format('MMM Do')}{' '}
            </time>

            <h3 className="-mb-1 text-sm font-semibold text-gray-900 dark:text-white">
              Payment
            </h3>
          </li>
          <li className="relative pl-4 pt-10">
            {/* <div className="absolute -left-1 top-0 h-[100%] w-[4px] rounded bg-amber-500"></div> */}
            <div className="absolute -left-2.5 mt-3.5 rounded-full">
              <CheckCircle2 className="h-4 w-4 rounded-full bg-slate-700 text-slate-400" />
            </div>
            <time className="text-body mb-1 text-xs font-normal leading-none">
              Closes at {moment(tournament.start_date).format('MMM Do')}{' '}
            </time>

            <h3 className="-mb-1 text-sm font-semibold text-gray-900 dark:text-white">
              Done
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
