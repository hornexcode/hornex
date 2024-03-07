import AdminTournamentStandingsTabContent from '../../molecules/admin-tournament-standings-tab-content/admin-tournament-standings-tab-content';
import AdminTournamentDetailsTabContent from '@/components/admin/molecules/admin-tournament-details-tab-content';
import AdminTournamentMatchesTabContent from '@/components/admin/molecules/admin-tournament-matches-tab-content';
import AdminTournamentTeamsTabContent from '@/components/admin/molecules/admin-tournament-teams-tab-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Gamepad2Icon, Users2Icon } from 'lucide-react';

const AdminTournamentTabNav = () => {
  return (
    <Tabs defaultValue="general-info" className="w-full">
      <TabsList>
        <TabsTrigger value="general-info">
          <InfoCircledIcon className="mr-2 h-5 w-5" />
          General info
        </TabsTrigger>
        <TabsTrigger value="matches">
          <Gamepad2Icon className="mr-2 h-5 w-5" />
          Matches
        </TabsTrigger>
        <TabsTrigger value="registered-teams">
          <Users2Icon className="mr-2 h-5 w-5" />
          Registered teams
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general-info">
        <AdminTournamentDetailsTabContent />
      </TabsContent>
      <TabsContent value="matches">
        <AdminTournamentMatchesTabContent />
      </TabsContent>
      <TabsContent value="registered-teams">
        <AdminTournamentTeamsTabContent />
      </TabsContent>
      <TabsContent value="standings">
        <AdminTournamentStandingsTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTournamentTabNav;
