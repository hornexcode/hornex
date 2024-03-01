import Button from '@/components/ui/atoms/button';
import { ExpiredLoginButton } from '@/components/ui/atoms/expired-login-button';
import { PodiumIcon } from '@/components/ui/atoms/icons';
import { Plus } from '@/components/ui/atoms/icons/plus';
import { AppLayout } from '@/layouts';
import { Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React from 'react';

const { useData: useTournaments } = dataLoader<Tournament[], {}>(
  'organizer:tournaments'
);

function DashboardPage() {
  const { data: tournaments } = useTournaments({});
  const router = useRouter();

  const { data: session } = useSession();
  if (!session) {
    return <ExpiredLoginButton />;
  }

  return (
    <div className="container mx-auto space-y-12 pt-12">
      <div className="flex items-center">
        <h1 className="text-title text-2xl">Manage Tournaments</h1>
        <div className="ml-auto">
          <Button
            onClick={() => {
              router.push('/admin/tournaments/create');
            }}
            shape="rounded"
            size="small"
            className="mt-4"
          >
            <div className="flex items-center">
              <Plus className="mr-2 w-3" />
              <span className="">Create Tournament</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col space-y-2">
        <div className="text-title grid w-full grid-cols-12 font-normal">
          <div className="col-span-6">Tournament</div>
          <div className="col-span-4">Team</div>
          <div className="col-span-2">Start Date</div>
        </div>
        <div className="flex flex-col">
          {tournaments &&
            tournaments.map((tournament) => (
              <TournamentRow tournament={tournament} key={tournament.uuid} />
            ))}
        </div>
      </div>
    </div>
  );
}

const TournamentRow = ({ tournament }: { tournament: Tournament }) => {
  const router = useRouter();
  return (
    <div
      className="bg-medium-dark border-border grid grid-cols-12 border-b p-4 transition-all hover:z-50 hover:cursor-pointer hover:shadow-xl"
      onClick={() => {
        router.push(
          `/admin/${tournament.platform}/${tournament.game}/tournaments/${tournament.uuid}`
        );
      }}
    >
      <div className="col-span-6 flex items-center">
        <PodiumIcon className="text-title mr-4 w-10" />
        <div>
          <div className="text-title text-lg">{tournament.name}</div>
          <div className="text-muted font-medium">{tournament.game}</div>
        </div>
      </div>

      <div className="col-span-2 flex items-center">
        <div className="text-title font-normal">
          {moment(tournament.start_date).format('MMM Do, YYYY')}
        </div>
      </div>
    </div>
  );
};

DashboardPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default DashboardPage;
