import AdminTournamentTeamRow from '../admin-tournament-team-row';
import { useAdminTournament } from '@/contexts';
import { Team } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import React, { FC } from 'react';

export type AdminTournamentTeamsTabContentProps = {};

const { useData: useGetTournamentMatchesQuery } = dataLoader<Team[]>(
  'organizer:tournament:matches'
);

const AdminTournamentTeamsTabContent: FC<
  AdminTournamentTeamsTabContentProps
> = () => {
  const { tournament } = useAdminTournament();

  const { data: teams, error } = useGetTournamentMatchesQuery({
    tournamentId: tournament.uuid,
  });

  return (
    <div className="flex flex-col">
      <div className="bg-medium-dark mb-2 flex items-center p-4">
        <div className="flex items-center">
          <div className="text-muted">Team name</div>
        </div>
        <div className="ml-auto flex items-center">
          <div className="text-muted ml-4">Actions</div>
        </div>
      </div>
      <div className="">
        <AdminTournamentTeamRow />
        <AdminTournamentTeamRow />
        <AdminTournamentTeamRow />
        <AdminTournamentTeamRow />
      </div>
    </div>
  );
};

export default AdminTournamentTeamsTabContent;
