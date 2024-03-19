import { Plus } from '@/components/ui/atoms/icons/plus';
import { Logo } from '@/components/ui/atoms/logo';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AppLayout } from '@/layouts';
import { getStatus, Tournament } from '@/lib/models/Tournament';
import { dataLoader } from '@/lib/request';
import { RocketIcon } from '@radix-ui/react-icons';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React from 'react';

const { useData: useTournamentsQuery } =
  dataLoader<Tournament[]>('org:tournaments');

function DashboardPage() {
  const { data: tournaments, error, isLoading } = useTournamentsQuery({});
  const router = useRouter();

  const renderTournaments = () => {
    if (isLoading) {
      return <TournamentsLoading />;
    }

    if (tournaments && !error) {
      if (tournaments.length === 0) {
        return <TournamentsEmptyFeedback />;
      }
      return <TournamentList tournaments={tournaments} />;
    }

    return <div>Something went wrong</div>;
  };

  return (
    <div className="container mx-auto space-y-12 pt-12">
      <div className="flex items-center">
        <h1 className="text-title text-3xl font-bold">Manage Tournaments</h1>
        <div className="ml-auto">
          <Button
            onClick={() => {
              router.push('/admin/tournaments/create');
            }}
            className="mt-4"
          >
            <div className="flex items-center">
              <Plus className="mr-2 w-3" />
              <span className="">Create Tournament</span>
            </div>
          </Button>
        </div>
      </div>
      {renderTournaments()}
    </div>
  );
}

const TournamentsLoading = () => (
  <div className="flex flex-col space-y-4">
    <Skeleton className="h-20" />
    <Skeleton className="h-20" />
    <Skeleton className="h-20" />
  </div>
);

const TournamentsEmptyFeedback = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Logo size="lg" className="opacity-20" />
      <h4 className="text-body/40 text-3xl font-bold leading-3">
        No tournaments found
      </h4>
      <p className="text-body/40 text-lg">
        You do not have any tournament created
      </p>
      <Button
        onClick={() => {
          router.push('/admin/tournaments/create');
        }}
      >
        Create new tournament
      </Button>
    </div>
  );
};

const TournamentListItem = ({ tournament }: { tournament: Tournament }) => {
  const router = useRouter();
  return (
    <div
      className="border-border mb-2 grid grid-cols-12 rounded border p-4 transition-all hover:z-10 hover:cursor-pointer"
      onClick={() => {
        router.push(
          `/admin/${tournament.platform}/${tournament.game}/tournaments/${tournament.id}`
        );
      }}
    >
      <div className="col-span-6 flex items-center px-4">
        <RocketIcon className="text-title mr-4 w-10" />
        <div>
          <div className="text-title text-lg font-bold">{tournament.name}</div>
          <div className="text-body text-sm font-medium">{tournament.game}</div>
        </div>
      </div>
      <div className="col-span-2 flex items-center">
        <div className="text-title font-normal">
          {moment(tournament.start_date).format('MMM Do, YYYY h:mm A')}
        </div>
      </div>
      <div className="col-span-2 flex items-center">
        <div className="text-dark bg-title rounded px-2 text-sm font-medium">
          {getStatus(tournament)}
        </div>
      </div>
    </div>
  );
};

const TournamentList = ({ tournaments }: { tournaments: Tournament[] }) => (
  <div className="flex w-full flex-col space-y-2">
    <div className="text-body grid w-full grid-cols-12 font-normal">
      <div className="col-span-6">Tournament</div>
      <div className="col-span-2">Start Date</div>
      <div className="col-span-2">State</div>
    </div>
    <div className="flex flex-col">
      {tournaments &&
        tournaments.map((tournament) => (
          <TournamentListItem tournament={tournament} key={tournament.id} />
        ))}
    </div>
  </div>
);

DashboardPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default DashboardPage;
