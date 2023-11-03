import { TeamsList } from '../team-list';
import Button from '@/components/ui/button';
import routes from '@/config/routes';
import { Team } from '@/lib/hx-app/types';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

type TeamsListTabPanelProps = {
  teams: Team[];
};

export const TeamsListTabPanel: FC<TeamsListTabPanelProps> = ({ teams }) => {
  const router = useRouter();

  return (
    <div className="mx-auto h-full space-y-8">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white  sm:text-2xl">
          Meus times
        </h2>

        <div>
          <Button
            onClick={() => router.push(routes.createTeam)}
            className="bg-light-dark"
            shape="rounded"
            variant="solid"
            size="small"
          >
            Create team
          </Button>
        </div>
      </div>

      <div className="h-[100vh]">
        <div id="teams" className="">
          <div className="grid gap-5">
            {teams && <TeamsList teams={teams} />}
          </div>
        </div>
      </div>
    </div>
  );
};
