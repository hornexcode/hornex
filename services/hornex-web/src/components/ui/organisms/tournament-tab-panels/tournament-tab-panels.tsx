import { Separator } from '../../separator';
import { Skeleton } from '../../skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Prize, Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { DotFilledIcon } from '@radix-ui/react-icons';
import moment from 'moment';
import { FC } from 'react';

type RegisteredTeam = {
  name: string;
  participants: { id: number; nickname: string }[];
};

const { useData: listTournamentTeams } = dataLoader<RegisteredTeam[]>(
  'listTournamentTeams'
);

const { useData: listTournamentPrizes } = dataLoader<Prize[]>(
  'listTournamentPrizes'
);

export type TournamentTabPanelsProps = {
  tournament: Tournament;
};

const TournamentTabPanels: FC<TournamentTabPanelsProps> = ({ tournament }) => {
  const { data: registeredTeams, error } = listTournamentTeams({
    tournamentId: tournament.id,
  });
  const { data: prizes } = listTournamentPrizes({
    tournamentId: tournament.id,
  });

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="prizes">Prizes</TabsTrigger>
        <TabsTrigger value="rules">Rules</TabsTrigger>
        <TabsTrigger value="brackets">Brackets</TabsTrigger>
        <TabsTrigger value="standings">Standings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-3">
        <div className="box space-y-12">
          <div className="block">
            <h3 className="mb-4 text-sm">Game & Region</h3>
            <div className="flex flex-wrap items-center">
              <div className="border-light-dark block border-r border-t p-3">
                <h4 className="mb-2 text-xs font-normal leading-none tracking-wide">
                  Game
                </h4>
                <span className="text-title text-lg font-normal">
                  League of Legends
                </span>
              </div>
              <div className="border-light-dark block border-r border-t p-3">
                <h4 className="mb-2 text-xs font-normal leading-none tracking-wide">
                  Region
                </h4>
                <span className="text-title text-lg font-normal">
                  🇧🇷 Brazil
                </span>
              </div>
              <div className="border-light-dark block border-r border-t p-3">
                <h4 className="mb-2 text-xs font-normal leading-none tracking-wide">
                  Map
                </h4>
                <span className="text-title text-lg font-normal">
                  Summoners Rift
                </span>
              </div>
            </div>
          </div>
          <div className="block">
            <h3 className="mb-4 text-sm">Date & Time</h3>
            <div className="flex flex-wrap items-center">
              <div className="border-light-dark block border-r border-t p-3">
                <h4 className="mb-2 text-xs font-normal leading-none tracking-wide">
                  Date
                </h4>
                <span className="text-title text-lg font-normal">
                  {moment(tournament.start_date).format('MMMM Do, YYYY')}
                </span>
              </div>
              <div className="border-light-dark block border-r border-t p-3">
                <h4 className="mb-2 text-xs font-normal leading-none tracking-wide">
                  Time
                </h4>
                <span className="text-title text-lg font-normal">
                  {moment(tournament.start_date).format('h:mm A')}
                </span>
              </div>
            </div>
          </div>
          <div className="block">
            <h3 className="text-title mb-4 text-lg font-bold">
              Registered teams
            </h3>
            {!registeredTeams && !error && (
              <Skeleton className="bg-light-dark h-[40px] w-full rounded" />
            )}
            <ul className="border-light-dark flex flex-wrap rounded border p-3 underline">
              {registeredTeams !== undefined &&
                registeredTeams.map((team, idx) => (
                  <li
                    key={idx}
                    className="mr-6 pb-1 hover:cursor-pointer hover:text-cyan-400"
                  >
                    <div className="flex items-center">
                      {team.name} <DotFilledIcon className="ml-2 w-4" />
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="prizes" className="p-3">
        <ul>
          {prizes &&
            prizes.map((prize, idx) => <Prize prize={prize} key={idx} />)}
        </ul>
      </TabsContent>
      <TabsContent value="rules">
        <p>Rules</p>
      </TabsContent>
    </Tabs>
  );
};

const Prize = ({ prize }: { prize: Prize }) => (
  <li key={prize.id} className="flex items-center space-x-2 font-normal">
    <span className="text-lg font-bold text-amber-500">{prize.place}</span>
    <span className="text-title tracking-wide">{prize.content}</span>
  </li>
);
export default TournamentTabPanels;
