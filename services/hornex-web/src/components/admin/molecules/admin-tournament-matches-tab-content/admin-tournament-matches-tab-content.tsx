import { AdminTournamentMatchesTabContentProps } from './admin-tournament-matches-tab-content.types';
import AdminTournamentMatch from '@/components/admin/molecules/admin-tournament-match/admin-tournament-match';
import { useTournament } from '@/contexts/tournament';
import { TournamentStatusOptions } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

type Match = {
  id: string;
};

const { useData: useGetTournamentMatchesQuery } = dataLoader<Match[]>(
  'org:tournament:matches'
);

const AdminTournamentMatchesTabContent: FC<
  AdminTournamentMatchesTabContentProps
> = ({}) => {
  const { tournament } = useTournament();

  if (tournament.status != TournamentStatusOptions.RUNNING) {
    return (
      <div className="text-muted mt-4 flex items-center font-normal">
        <ExclamationCircleIcon className="text-warning mr-2 w-4" />
        <p className="">Matches are only available for running tournaments</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <AdminTournamentMatch />
      <AdminTournamentMatch />
      <AdminTournamentMatch />
    </div>
  );
};

export default AdminTournamentMatchesTabContent;
