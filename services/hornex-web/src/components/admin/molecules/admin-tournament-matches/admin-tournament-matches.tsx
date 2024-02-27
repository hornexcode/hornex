import { AdminTournamentMatchesListProps } from './admin-tournament-matches.types';
import AdminTournamentMatch from '@/components/admin/molecules/admin-tournament-match/admin-tournament-match';
import { dataLoader } from '@/lib/request';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

type Match = {
  id: string;
};

const { useData: useGetTournamentMatchesQuery } = dataLoader<Match[]>(
  'organizer:tournaments:matches'
);

const AdminTournamentMatchesList: FC<
  AdminTournamentMatchesListProps
> = ({}) => {
  const router = useRouter();
  const { tournamentId } = router.query;

  // const {
  //   data: matches,
  //   isLoading,
  //   error,
  // } = useGetTournamentMatchesQuery({
  //   tournamentId,
  // });

  // if (isLoading) {
  //   return <p>loading</p>;
  // }

  // if (error) {
  //   return <p>error loading matche</p>;
  // }

  return (
    <div className="flex flex-col space-y-4">
      <AdminTournamentMatch />
      <AdminTournamentMatch />
      <AdminTournamentMatch />
    </div>
  );
};

export default AdminTournamentMatchesList;
