import { getStatus, Tournament } from '@/lib/models/Tournament';
import { cn } from '@/lib/utils';
import { UsersIcon } from 'lucide-react';
import React from 'react';

const TournamentRegistrationStateProgress = ({
  tournament,
  className,
}: {
  tournament: Tournament;
  className?: string;
}) => {
  const getProgressBarBackgroundColor = () => {
    switch (tournament.status) {
      case 'announced':
        return 'bg-background';
      case 'registering':
      case 'ended':
      case 'running':
        return 'bg-brand';
    }
  };

  const getProgressBarPercentage = () => {
    const total =
      (tournament.registered_teams.length / tournament.max_teams) * 100;
    return `${total.toFixed(0)}% Full`;
  };
  return (
    <div className={cn('grid grid-cols-2 space-y-4', className)}>
      <div className="col-span-2">
        <div className="flex justify-between">
          <div className="flex items-center">
            <UsersIcon className="mr-1 h-4 w-4 text-white" />
            <span className="pr-4 font-medium text-white">
              {getProgressBarPercentage()}
            </span>
          </div>
          {/* phase status */}
          <div className="relative flex">
            <span className="absolute -left-3 top-2 h-2 w-2 rounded-full bg-green-400"></span>
            <span className="font-bold text-green-400">
              {getStatus(tournament)}
            </span>
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <div className="flex items-center">
          <div className={cn('flex w-full')}>
            {/* build a progress bar */}
            <div className="bg-title/20 flex w-full rounded-lg">
              <div
                style={{
                  width: `${
                    (tournament.registered_teams.length /
                      tournament.max_teams) *
                    100
                  }%`,
                }}
                className={cn(
                  'bg-brand h-2 rounded-lg',
                  getProgressBarBackgroundColor()
                )}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentRegistrationStateProgress;
