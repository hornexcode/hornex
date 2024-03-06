import AdminTournamentStandingsTabContent from '../admin-tournament-standings-tab-content/admin-tournament-standings-tab-content';
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
import TournamentStatusStepper from '@/components/ui/organisms/tournament-status-stepper';
import { toast } from '@/components/ui/use-toast';
import { useAdminTournament } from '@/contexts';
import {
  getEntryFee,
  getPotentialPrizePool,
  getStatus,
  getStatusStep,
  Tournament,
} from '@/lib/models/Tournament';
import { toCurrency } from '@/lib/utils';
import {
  finalizeTournamentHandler,
  openRegistrationHandler,
  startTournamentHandler,
  useGetTournamentResults,
} from '@/pages/admin/[platform]/[game]/tournaments/[id]/admin-tournament-details.handlers';
import { datetime } from '@/utils/datetime';
import { Loader2 } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const AdminTournamentGeneralInfo = () => {
  const { tournament, refreshTournament } = useAdminTournament();
  const { data: tournamentResults } = useGetTournamentResults({
    id: tournament.id,
  });

  console.log();
  const [steps, setSteps] = React.useState(
    getStatusStep((tournament || {}) as Tournament)
  );
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setSteps(getStatusStep((tournament || {}) as Tournament));
  }, [tournament]);

  if (!tournament) {
    return <p>Failed to load tournament metadata</p>;
  }

  const onOpenRegistrationHandler = async () => {
    setLoading(true);
    const { data, error } = await openRegistrationHandler({
      tournamentId: tournament.id,
    });

    if (!data && error) {
      toast({
        title: 'Error',
        description: error.message,
      });
    }

    if (data && !error) {
      refreshTournament(data);
      toast({
        title: 'Success',
        description: 'Registration opened successfully',
      });
    }
    setLoading(false);
  };

  const onStartTournamentHandler = async () => {
    setLoading(true);
    const { data, error } = await startTournamentHandler({
      tournamentId: tournament.id,
    });
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
      });
    }
    if (data && !error) {
      refreshTournament(data);
      toast({
        title: 'Success',
        description: 'Tournament started successfully',
      });
    }
    setLoading(false);
  };

  const onFinalizeTournamentHandler = async () => {
    setLoading(true);
    const { data, error } = await finalizeTournamentHandler({
      id: tournament.id,
    });
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
      });
    }
    if (data && !error) {
      refreshTournament(data);
      toast({
        title: 'Success',
        description: 'Tournament finalized successfully',
      });
    }
    setLoading(false);
  };

  const StartTournamentConfirmAlertDialog = () => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button shape="rounded" className="mt-4" size="mini">
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

  const renderStatusContent = () => {
    switch (tournament.status) {
      case 'announced':
        return (
          <>
            <div className="text-muted py-2">
              Registration start date:{' '}
              <span className="font-bold">
                {moment(tournament.registration_start_date).format('YYYY-MM-D')}
              </span>
              <div className="text-xs font-semibold">
                date format: (year-month-day)
              </div>
            </div>
            <Button
              onClick={onOpenRegistrationHandler}
              disabled={loading}
              isLoading={loading}
              shape="rounded"
              className="mt-4"
              size="mini"
            >
              Open registration
            </Button>
          </>
        );
      case 'registering':
        return (
          <>
            <div className="text-title py-2">
              Registration end date:{' '}
              <span className="font-bold">
                {moment(tournament.registration_start_date).format('YYYY-MM-D')}
              </span>
              <div className="text-xs font-semibold">
                date format: (year-month-day)
              </div>
            </div>
            {!loading && <StartTournamentConfirmAlertDialog />}
            {loading && (
              <div className="flex items-center italic">
                <Loader2 className="mr-2 w-5 animate-spin opacity-50" />{' '}
                starting tournament
              </div>
            )}
          </>
        );
      case 'running':
        return (
          <>
            <div className="text-muted py-2">
              Registration end date:{' '}
              <span className="font-bold">
                {moment(tournament.registration_start_date).format('YYYY-MM-D')}
              </span>
              <div className="text-xs font-semibold">
                date format: (year-month-day)
              </div>
            </div>
            <Button
              onClick={onFinalizeTournamentHandler}
              shape="rounded"
              className="mt-4"
              color="danger"
              size="mini"
            >
              Finalize
            </Button>
          </>
        );
      case 'ended':
        return (
          <div className="text-title py-2 font-normal">
            Ended at: {moment(tournament.ended_at).format('DD MM, YYYY')}
          </div>
        );
    }
  };

  const hasStandings =
    tournament.status === 'running' || tournament.status === 'ended';

  return (
    <div className="mt-4 grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <div className="flex flex-wrap items-center rounded">
          <div className="border-border border-r border-t p-3">
            <div className="font-normal">Teams registered</div>
            <div className="text-title">
              {tournament.registered_teams_count}/{tournament.max_teams}
            </div>
          </div>
          <div className="border-border border-r border-t p-3">
            <div className="font-normal">Entry Fee</div>
            <div className="text-title">{getEntryFee(tournament)}</div>
          </div>
          <div className="border-border border-r border-t p-3">
            <div className="font-normal">Prize Pool</div>
            <div className="text-title">
              {tournament.prize_pool_enabled ? 'Enabled' : 'Disabled'}
              {tournament.prize_pool_enabled &&
                `${tournament.currency} ${toCurrency(
                  getPotentialPrizePool(tournament)
                )}`}
            </div>
          </div>
          <div className="border-border border-r border-t p-3">
            <div className="font-normal">Registration start date</div>
            <div className="text-title">
              {datetime(tournament.registration_start_date, { time: false })}
            </div>
          </div>
          <div className="border-border border-r border-t p-3">
            <div className="font-normal">Start date</div>
            <div className="text-title">
              {moment(
                new Date(
                  `${tournament.start_date}T${tournament.start_time}+00:00`
                )
              ).format('YYYY-MM-D hh:mm A')}
            </div>
          </div>
          <div className="border-border border-r border-t p-3">
            <div className="font-normal">Check-in window</div>
            <div className="text-title">
              {tournament.check_in_duration} minutes
            </div>
          </div>
        </div>
      </div>
      <div className="bg-medium-dark col-span-1 p-6">
        <span className="text-muted">Tournament status</span>
        <div className="flex items-center justify-between pb-2">
          <span className="font-semibold text-amber-500">
            {getStatus(tournament)}
          </span>
          <div className="text-xs text-gray-500">
            step {steps[0]} / {steps[1]}
          </div>
        </div>
        <TournamentStatusStepper steps={steps[1]} currentStep={steps[0]} />
        {renderStatusContent()}
      </div>
      <div className="col-span-1 col-start-3 mt-2">
        <h4 className="text-title mb-3 text-lg font-bold">Results</h4>
        <div className="bg-medium-dark ">
          {hasStandings && tournamentResults && (
            <AdminTournamentStandingsTabContent standings={tournamentResults} />
          )}
        </div>
      </div>
      {/* danger zone */}
      <div className="col-span-3">
        <h4 className="text-title mb-3 text-lg font-bold">Danger Zone</h4>
        <div className="text-title border-border flex items-center justify-between rounded border p-4">
          <div>
            <p className="font-bold">Delete this tournament</p>
            <p className="font-normal">
              Once you delete a tournament, there is no going back. Please be
              certain.{' '}
            </p>
          </div>
          <Button color="danger" shape="rounded" size="mini">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminTournamentGeneralInfo;
