import { EyeIcon } from '@/components/ui/atoms/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { DotFilledIcon } from '@radix-ui/react-icons';
import { DotIcon } from 'lucide-react';
import { FC } from 'react';

type RegisteredTeam = {
  name: string;
  participants: { id: number; nickname: string }[];
};

const { useData: listRegisteredTeams } = dataLoader<RegisteredTeam[]>(
  'listTournamentTeams'
);

type TournamentOverviewTabPanelProps = {
  tournament: Tournament;
};

export const TournamentOverviewTabPanel: FC<
  TournamentOverviewTabPanelProps
> = ({ tournament }) => {
  const { data: registeredTeams, error } = listRegisteredTeams({
    tournamentId: tournament.id,
  });

  console.log(registeredTeams);

  return (
    <div className="box space-y-12">
      <div className="block">
        <h3 className="text-title mb-4 text-lg font-bold">Game info</h3>
        <div className="flex flex-wrap items-center">
          <div className="block border-r border-dashed border-gray-700 pr-6 ">
            <h4 className="mb-2 leading-none tracking-wide">Game</h4>
            <span className="font-semibold text-amber-400">
              League of Legends
            </span>
          </div>
          <div className="block border-r border-dashed border-gray-700 px-6 ">
            <h4 className="mb-2 leading-none tracking-wide">Platform</h4>
            <span className="font-semibold text-amber-400">PC</span>
          </div>
          <div className="block border-r border-dashed border-gray-700 px-6 ">
            <h4 className="mb-2 leading-none tracking-wide">Format</h4>
            <span className="font-semibold text-amber-400">
              {tournament.team_size}x{tournament.team_size}
            </span>
          </div>
          <div className="block border-gray-700 px-6 ">
            <h4 className="mb-2 leading-none tracking-wide">Map</h4>
            <span className="font-semibold text-amber-400">Summoners Rift</span>
          </div>
        </div>
      </div>
      <div className="block">
        <h3 className="text-title mb-4 text-lg font-bold">Registered teams</h3>
        {!registeredTeams && !error && (
          <Skeleton className="bg-light-dark h-[40px] w-full rounded" />
        )}
        <ul className="border-light-dark flex flex-wrap rounded border p-3 underline">
          {registeredTeams !== undefined &&
            registeredTeams.map((team, idx) => (
              <li
                key={idx}
                className="mr-6 pb-1 hover:cursor-pointer hover:text-amber-400"
              >
                <div className="flex items-center">
                  {team.name} <DotFilledIcon className="ml-2 w-4" />
                </div>
              </li>
            ))}
        </ul>
      </div>
      <div className="block">
        <h3 className="text-title text-lg font-bold">Sponsors & Partners</h3>
      </div>
    </div>
  );
};
