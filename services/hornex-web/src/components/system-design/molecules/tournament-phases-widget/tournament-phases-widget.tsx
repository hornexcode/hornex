import Button from '@/components/ui/button/button';
import { Tournament } from '@/lib/hx-app/types';
import classnames from 'classnames';
import { UsersIcon } from 'lucide-react';
import { FC } from 'react';

type TournamentPhasesWidgetProps = {
  tournament: Tournament;
};

const TournamentPhasesWidget: FC<TournamentPhasesWidgetProps> = ({
  tournament,
}) => {
  return (
    <div className="bg-light-dark shadow-light space-y-2 rounded-md ">
      <div className="border-b border-gray-800 p-5">
        <h4 className="leading-2 text-sm font-medium uppercase text-gray-200">
          Tournament Phases
        </h4>
      </div>
      <div className="block p-5">
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
          <li className="mb-10 border-l pl-4 dark:border-amber-400">
            <div className="dark:border-light-dark absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-gray-200 dark:bg-amber-400"></div>
            <time className="mb-1 text-xs font-normal leading-none text-gray-400 dark:text-gray-500">
              February 2022
            </time>

            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Registration
            </h3>
            <p className="mb-4 text-xs font-normal text-gray-500 dark:text-gray-400">
              Register your team so you can get paid to play.
            </p>

            <div className="mb-4 block space-y-2">
              <div className="col-span-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <UsersIcon className="mr-1 h-5 w-4 " />
                    <span className="pr-4 text-xs font-bold text-white">
                      1/16
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <div className={classnames('flex w-full')}>
                  {Array.from({ length: 16 }).map((_, index) => (
                    <div
                      key={index}
                      className={classnames(
                        'flex-basis mr-1 h-2 flex-grow rounded-[2px]  bg-amber-400',
                        {
                          'bg-gray-700': index > tournament.teams.length - 1,
                        }
                      )}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </li>
          <li className="mb-10 ml-4">
            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-xs font-normal leading-none text-gray-400 dark:text-gray-500">
              to be defined
            </time>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Results tracking
            </h3>
            <p className="text-xs font-normal text-gray-500 dark:text-gray-400">
              Coleta de dados
            </p>
          </li>
          <li className="ml-4">
            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-xs font-normal leading-none text-gray-400 dark:text-gray-500">
              to be defined
            </time>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Payment
            </h3>
            <p className="text-xs font-normal text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit.
            </p>
          </li>
        </ol>
      </div>

      <div className="block border-t-2 border-slate-800 p-5">
        <Button color="warning" fullWidth shape="rounded">
          Registrar
        </Button>
      </div>
    </div>
  );
};

export default TournamentPhasesWidget;
