import TournamentStandingsTabContent from '../../molecules/tournament-standings-tab-content/tournament-standings-tab-content';
import TournamentDetailsPrizesTabContent from '@/components/ui/molecules/tournament-details-prizes-tab-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Prize as PrizeType, Tournament } from '@/lib/models';
import { Standing } from '@/lib/models/Standing';
import { dataLoader } from '@/lib/request';
import moment from 'moment';
import { FC } from 'react';

const { useData: listTournamentStandings } = dataLoader<Standing[]>(
  'listTournamentStandings'
);

export type TournamentTabPanelsProps = {
  tournament: Tournament;
};

const TournamentTabPanels: FC<TournamentTabPanelsProps> = ({ tournament }) => {
  const { data: standings } = listTournamentStandings({
    tournamentId: tournament.id,
  });

  const hasStandings =
    tournament.status === 'running' || tournament.status === 'ended';

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="prizes">Prizes</TabsTrigger>
        <TabsTrigger value="rules">Rules</TabsTrigger>
        <TabsTrigger value="brackets">Brackets</TabsTrigger>
        <TabsTrigger value="standings">Standings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="border-border rounded border">
        <div className="box">
          <div className="border-border block border-b p-6">
            <h3 className="text-body">Game & Region</h3>
            <div className="flex flex-wrap items-center">
              <div className="border-muted block pr-5">
                <div className="text-title">League of Legends - Brazil</div>
              </div>
            </div>
          </div>

          <div className="block p-6">
            <h3 className="text-body">Date & Time</h3>
            <div className="flex flex-wrap items-center">
              <div className="block pr-4">
                <div className="text-title">
                  {moment(tournament.start_date).format('MMMM Do, YYYY')}{' '}
                  {moment(tournament.start_date).format('h:mm A')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="prizes" className="">
        <TournamentDetailsPrizesTabContent />
      </TabsContent>
      <TabsContent value="rules">
        <p>Rules</p>
      </TabsContent>
      <TabsContent value="brackets">
        <div className="">
          <iframe
            src={`${tournament.challonge_tournament_url}/module?show_live_status=0`}
            width="100%"
            height="600"
            frameBorder={0}
            scrolling="auto"
            // allowTransparency={true}
          ></iframe>
        </div>
      </TabsContent>
      <TabsContent value="standings">
        <div className="block">
          {hasStandings && standings && (
            <TournamentStandingsTabContent standings={standings} />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

const Prize = ({ prize }: { prize: PrizeType }) => (
  <li key={prize.id} className="flex items-center space-x-2 font-normal">
    <span className="font-bold text-amber-500">{prize.place}</span>
    <span className="text-title tracking-wide">{prize.content}</span>
  </li>
);
export default TournamentTabPanels;
