import AdminTournamentGeneralInfo from '../../organisms/admin-tournament-general-info';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Gamepad2Icon } from 'lucide-react';

const AdminTournamentTabNav = () => {
  return (
    <Tabs defaultValue="general-info" className="w-full">
      <TabsList>
        <TabsTrigger value="general-info" className="tracking-wider">
          <InfoCircledIcon className="mr-2 h-5 w-5" />
          General info
        </TabsTrigger>
        <TabsTrigger value="password" className="tracking-wider">
          <Gamepad2Icon className="mr-2 h-5 w-5" />
          Matches
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general-info">
        <AdminTournamentGeneralInfo />
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default AdminTournamentTabNav;
