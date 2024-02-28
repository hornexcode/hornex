import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import Button from '@/components/ui/atoms/button';
import { Team } from '@/domain';
import { dataLoader } from '@/lib/request';
import { LoaderIcon } from 'lucide-react';
import Image from 'next/image';
import { FC, useState } from 'react';

type AdminTournamentTeamRowProps = {
  team: Pick<Team, 'id' | 'name'>;
  tournament_id: string;
  tournament_started: boolean;
  onDelete: () => void;
};

const { delete: removeRegisteredTeam } = dataLoader(
  'organizer:tournament:team:remove'
);

const AdminTournamentTeamRow: FC<AdminTournamentTeamRowProps> = ({
  team,
  tournament_id,
  tournament_started,
  onDelete,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const removeTeamHandler = async (id: string) => {
    setIsLoading(true);

    await removeRegisteredTeam({ tournamentId: tournament_id, teamId: id });
    onDelete();

    setIsLoading(false);
  };

  return (
    <div className="bg-medium-dark border-border flex items-center border-b p-4">
      <div className="flex items-center space-x-4">
        <Image alt="hornex-logo" src={HornexLogo} width={32} height={32} />
        <div className="text-title">{team.name}</div>
      </div>
      <div className="ml-auto flex items-center">
        <div className="text-muted ml-4">
          <Button
            shape="rounded"
            color="danger"
            size="mini"
            disabled={tournament_started}
            onClick={() => removeTeamHandler(team.id)}
          >
            {isLoading ? <LoaderIcon className="animate-spin" /> : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminTournamentTeamRow;
