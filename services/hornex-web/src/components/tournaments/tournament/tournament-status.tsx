import { CurrencyDollarIcon, UsersIcon } from '@heroicons/react/20/solid';
import classnames from 'classnames';

export const TournamentStatus = () => {
  return (
    <>
      {/* status */}
      <div className="flex justify-between">
        <div className="flex items-center">
          <CurrencyDollarIcon className="mr-1 h-5 w-4 fill-slate-300" />
          <span
            data-tooltip="tooltip-prize"
            className="text-xs font-bold text-white"
          >
            120 / 1500 BRL
          </span>
        </div>
        <div className="relative flex">
          <span className="absolute -left-3 top-1 h-2 w-2 rounded-full bg-green-400"></span>
          <span className="text-xs font-bold uppercase text-green-400">
            open
          </span>
        </div>
      </div>
      {/* status */}
      <div className="flex items-center">
        <div className="flex">
          <UsersIcon className="mr-1 h-5 w-4 fill-slate-300" />
          <span className="pr-4 text-xs font-bold text-white">4/16</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={classnames('h-1.5 rounded-full bg-green-400', 'w-[70%]')}
          ></div>
        </div>
      </div>
    </>
  );
};
