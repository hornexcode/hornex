import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Prize, Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import moment from 'moment';
import { FC } from 'react';

const { useData: listTournamentPrizes } = dataLoader<Prize[]>(
  'listTournamentPrizes'
);

export type TournamentTabPanelsProps = {
  tournament: Tournament;
};

const TournamentTabPanels: FC<TournamentTabPanelsProps> = ({ tournament }) => {
  const { data: prizes } = listTournamentPrizes({
    tournamentId: tournament.uuid,
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
      <TabsContent value="overview" className="bg-light-dark p-4">
        <div className="box space-y-12">
          <div className="block">
            <h3 className="text-sm uppercase">Game & Region</h3>
            <div className="flex flex-wrap items-center">
              <div className="border-muted block border-r border-dashed pr-5">
                <span className="text-title font-normal">
                  League of Legends
                </span>
              </div>
              <div className="border-muted block px-4">
                <span className="text-title font-normal">🇧🇷 Brazil</span>
              </div>
            </div>
          </div>
          <div className="block">
            <h3 className="text-sm uppercase">Date & Time</h3>
            <div className="flex flex-wrap items-center">
              <div className="border-muted block border-r border-dashed pr-4">
                <span className="text-title font-normal">
                  {moment(tournament.start_date).format('MMMM Do, YYYY')}
                </span>
              </div>
              <div className="border-muted block border-r border-dashed px-4">
                <span className="text-title font-normal">
                  {moment(tournament.start_date).format('h:mm A')}
                </span>
              </div>
            </div>
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
    <span className="font-bold text-amber-500">{prize.place}</span>
    <span className="text-title tracking-wide">{prize.content}</span>
  </li>
);
export default TournamentTabPanels;
