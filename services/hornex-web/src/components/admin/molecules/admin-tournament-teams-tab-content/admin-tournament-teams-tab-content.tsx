import AdminTournamentTeamRow from '../admin-tournament-team-row';
import { useAdminTournament } from '@/contexts';
import { getStartAt, getStatus, Team, TournamentPhase } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import React, { FC } from 'react';

export type AdminTournamentTeamsTabContentProps = {};

const { useData: useGetTournamentRegisteredTeams } = dataLoader<
  Pick<Team, 'id' | 'name'>[]
>('organizer:tournament:teams');

const AdminTournamentTeamsTabContent: FC<
  AdminTournamentTeamsTabContentProps
> = () => {
  const { tournament } = useAdminTournament();

  const {
    data: registeredTeams,
    error,
    mutate,
  } = useGetTournamentRegisteredTeams({
    tournamentId: tournament.id,
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
        {registeredTeams &&
          registeredTeams.map((team) => (
            <AdminTournamentTeamRow
              key={team.id}
              team={team}
              onDelete={() => mutate()}
              tournament_id={tournament.id}
              tournament_started={
                Date.now() >
                new Date(
                  `${tournament.start_date}T${tournament.start_time}+00:00`
                ).getTime()
              }
            />
          ))}
      </div>
    </div>
  );
};

export default AdminTournamentTeamsTabContent;
