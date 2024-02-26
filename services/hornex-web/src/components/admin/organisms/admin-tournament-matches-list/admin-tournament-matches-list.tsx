import { AdminTournamentMatchesListProps } from './admin-tournament-matches-list.types';
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

  const {
    data: matches,
    isLoading,
    error,
  } = useGetTournamentMatchesQuery({
    tournamentId,
  });

  if (isLoading) {
    return <p>loading</p>;
  }

  if (error) {
    return <p>error loading matche</p>;
  }

  return (
    <div>
      <h1>Matches</h1>
      {/* <AdminTournamentMatchesListTable matches={data?.tournamentMatches} /> */}
    </div>
  );
};

export default AdminTournamentMatchesList;
