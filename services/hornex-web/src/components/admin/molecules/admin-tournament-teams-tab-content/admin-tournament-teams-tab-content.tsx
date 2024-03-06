import AdminTournamentTeamRow from '../admin-tournament-team-row';
import { useAdminTournament } from '@/contexts';
import { Registration } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import React, { FC } from 'react';

export type AdminTournamentTeamsTabContentProps = {};

const { useData: useGetTournamentRegistrationsQuery } = dataLoader<
  Registration[]
>('org:tournament:registrations');

const AdminTournamentTeamsTabContent: FC<
  AdminTournamentTeamsTabContentProps
> = () => {
  const { tournament } = useAdminTournament();

  const {
    data: registrations,
    error,
    isLoading,
  } = useGetTournamentRegistrationsQuery({
    tournamentId: tournament.id,
  });

  if (error || !registrations) {
    return (
      <div className="bg-medium-dark tex-title rounded p-4">
        {true && (
          <div className="text-danger flex flex-col items-center">
            <ExclamationCircleIcon className="w-10" />
            <p className="text-lg">Failed to load teams</p>
          </div>
        )}
        {isLoading && <div className="text-muted">Loading teams...</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="">
        {registrations.map((registration) => (
          <AdminTournamentTeamRow
            registration={registration}
            key={registration.id}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminTournamentTeamsTabContent;
