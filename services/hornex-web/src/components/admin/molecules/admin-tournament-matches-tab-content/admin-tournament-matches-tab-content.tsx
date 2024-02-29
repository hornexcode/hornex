import { AdminTournamentMatchesTabContentProps } from './admin-tournament-matches-tab-content.types';
import AdminTournamentMatch from '@/components/admin/molecules/admin-tournament-match/admin-tournament-match';
import { dataLoader } from '@/lib/request';
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
  //   return <p>error loading matches</p>;
  // }

  return (
    <div className="flex flex-col space-y-4">
      <AdminTournamentMatch />
      <AdminTournamentMatch />
      <AdminTournamentMatch />
    </div>
  );
};

export default AdminTournamentMatchesTabContent;
