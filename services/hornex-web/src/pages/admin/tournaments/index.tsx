import TournamentTable from '@/components/admin/organisms/tournament-table';
import Button from '@/components/ui/atoms/button';
import { ExpiredLoginButton } from '@/components/ui/atoms/expired-login-button';
import { AppLayout } from '@/layouts';
import { Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React from 'react';

const { useData: useTournaments } = dataLoader<Tournament[], {}>(
  'organizer:tournaments'
);

function DashboardPage() {
  const { data: tournaments, isLoading } = useTournaments({});
  const router = useRouter();

  const { data: session } = useSession();
  if (!session) {
    return <ExpiredLoginButton />;
  }

  return (
    <div className="container mx-auto pt-8">
      <div className="text-title text-3xl font-bold">
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
