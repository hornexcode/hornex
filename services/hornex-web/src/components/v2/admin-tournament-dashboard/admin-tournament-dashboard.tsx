'use client';

import AdminTournamentTabNav from '@/components/admin/organisms/admin-tournament-tab-nav';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Button from '@/components/ui/atoms/button';
import routes from '@/config/routes';
import { AdminTournamentContextProvider } from '@/contexts';
import { Tournament } from '@/lib/models/Tournament';
import { dataLoader } from '@/lib/request';
import { ArrowLongLeftIcon } from '@heroicons/react/20/solid';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { FC } from 'react';
import { toast } from 'sonner';

const { submit: startTournament } = dataLoader<
  Tournament,
  { timestamp: number; now: Date }
>('org:tournament:start');
const startTournamentHandler = ({ tournamentId }: { tournamentId: string }) =>
  startTournament(
    { id: tournamentId },
    {
      timestamp: Date.now(),
      now: new Date(),
    }
  );

const { submit: updateTournament } = dataLoader<
  Tournament,
  Partial<Tournament>
>('organizer:tournament:update');
const openRegistrationHandler = ({ tournamentId }: { tournamentId: string }) =>
  updateTournament(
    { tournamentId },
    {
      status: 'registering',
      registration_start_date: new Date().toISOString(),
    }
  );

export type AdminTournamentDashboardTemplateProps = {
  tournament: Tournament;
};

const AdminTournamentDashboardTemplate: FC<
  AdminTournamentDashboardTemplateProps
> = ({ tournament }) => {
  const [loading, setLoading] = React.useState(false);

  const onStartTournamentHandler = async () => {
    setLoading(true);
    const { data, error } = await startTournamentHandler({
      tournamentId: tournament.id,
    });
    if (error) {
      toast(error.message);
    }
    if (data && !error) {
      toast('Tournament started successfully');
    }
    setLoading(false);
  };

  const StartTournamentButton = () => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button shape="rounded" className="mt-4" size="small">
            Start tournament
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              This action cannot be undone. After you start the tournament, it
              will create matches and teams will be locked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onStartTournamentHandler}>
              Start tournament
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const onOpenRegistrationHandler = async () => {
    setLoading(true);
    const { data, error } = await openRegistrationHandler({
      tournamentId: tournament.id,
    });

    if (!data && error) {
      toast(error.message);
    }

    if (data && !error) {
      toast('Registration opened successfully');
    }
    setLoading(false);
  };

  const renderActionButton = () => {
    switch (tournament.status) {
      case 'announced':
        return (
          <Button
            onClick={onOpenRegistrationHandler}
            disabled={loading}
            isLoading={loading}
            shape="rounded"
            className="mt-4"
            size="small"
          >
            Open registration
          </Button>
        );
      case 'registering':
        return (
          <>
            {!loading && <StartTournamentButton />}
            {loading && (
              <div className="flex  items-center italic">
                <Loader2 className="mr-2 w-5 animate-spin opacity-50" />{' '}
                starting tournament
              </div>
            )}
          </>
        );
      case 'running':
        return <></>;
      default:
        break;
    }
  };

  return (
    <AdminTournamentContextProvider tournament={tournament}>
      <div className="min-h-screen w-full p-6">
        <Link
          href={routes.admin.tournaments}
          className="text-title flex items-center"
        >
          <ArrowLongLeftIcon className="mr-2 w-5" />
          Back
        </Link>
        <div className="flex items-center justify-between pb-4">
          <h1 className="text-title text-3xl font-bold">{tournament.name}</h1>
        </div>

        <AdminTournamentTabNav />
      </div>
    </AdminTournamentContextProvider>
  );
};
export default AdminTournamentDashboardTemplate;
