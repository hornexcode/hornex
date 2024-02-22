import TournamentTable from '@/components/admin/organisms/tournament-table';
import Button from '@/components/ui/atoms/button';
import routes from '@/config/routes';
import { AppLayout } from '@/layouts';
import { Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

const { useData: useTournaments } = dataLoader<Tournament[], {}>(
  'listTournaments'
);

function DashboardPage() {
  const { data: tournaments, error, isLoading } = useTournaments({});
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    status === 'unauthenticated' && router.push(`/${routes.signIn}`);
  }, []);

  return (
    <div className="container mx-auto pt-8">
      <div className="text-title font-title text-3xl font-bold">
        Tournament Organizer Admin
      </div>
      <div>
        <Button
          onClick={() => {
            router.push('/admin/tournaments/create');
          }}
          shape="rounded"
          size="mini"
          className="mt-4"
        >
          Create Tournament
        </Button>
      </div>
      <div className="mt-4">
        {!isLoading && tournaments && (
          <TournamentTable tournaments={tournaments} />
        )}
      </div>
    </div>
  );
}

DashboardPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default DashboardPage;
