import TournamentStatusStepper from '../../../ui/organisms/tournament-status-stepper';
import Button from '@/components/ui/atoms/button';
import { toast } from '@/components/ui/use-toast';
import { useAdminTournament } from '@/contexts';
import {
  getClassifications,
  getEntryFee,
  getPotentialPrizePool,
  getStatus,
  getStatusStep,
  Tournament,
} from '@/lib/models';
import { toCurrency } from '@/lib/utils';
import {
  openRegistrationHandler,
  startTournamentHandler,
} from '@/pages/admin/[platform]/[game]/tournaments/[id]/admin-tournament-details.handlers';
import { datetime } from '@/utils/datetime';
import moment from 'moment';
import React, { useEffect } from 'react';

const AdminTournamentGeneralInfo = () => {
  const { tournament } = useAdminTournament();
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

    if (data && !error) {
      setSteps(getStatusStep(data));
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
      toast({
        title: 'Success',
        description: 'Tournament started successfully',
      });
    }
    setLoading(false);
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
              onClick={onStartTournamentHandler}
              shape="rounded"
              className="mt-4"
              size="mini"
            >
              Start tournament
            </Button>
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
              onClick={onStartTournamentHandler}
              shape="rounded"
              className="mt-4"
              size="mini"
            >
              Finish tournament
            </Button>
          </>
        );
    }
  };

  return (
    <div className="mt-4 grid grid-cols-3 gap-4">
      <div className="bg-medium-dark shadow-card col-span-1 rounded p-4">
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
      <div className="col-span-2">
        <div className="text-backround bg-light-dark shadow-card flex flex-wrap items-center rounded p-3">
          <div className="p-3">
            <div className="text-title font-bold">Teams registered</div>
            <div className="text-muted font-display">
              {tournament.total_participants / tournament.team_size}/
              {tournament.max_teams}
            </div>
          </div>
          <div className="p-3">
            <div className="text-title font-bold">Classification</div>
            <div className="text-muted font-display">
              {getClassifications(tournament)}
            </div>
          </div>
          <div className="p-3 ">
            <div className="text-title font-bold">Entry Fee</div>
            <div className="text-muted font-display">
              {getEntryFee(tournament)}
            </div>
          </div>
          <div className="p-3">
            <div className="text-title font-bold">Prize Pool</div>
            <div className="text-muted font-display">
              {tournament.prize_pool_enabled ? 'Enabled' : 'Disabled'}
              {tournament.prize_pool_enabled &&
                `${tournament.currency} ${toCurrency(
                  getPotentialPrizePool(tournament)
                )}`}
            </div>
          </div>
          <div className="p-3">
            <div className="text-title font-bold">Registration start date</div>
            <div className="text-muted font-display">
              {datetime(tournament.registration_start_date, { time: false })}
            </div>
          </div>
          <div className="p-3">
            <div className="text-title font-bold">Start date</div>
            <div className="text-muted font-display">
              {moment(
                new Date(
                  `${tournament.start_date}T${tournament.start_time}+00:00`
                )
              ).format('YYYY-MM-D hh:mm A')}
            </div>
          </div>
          <div className="p-3">
            <div className="text-title font-bold">Check-in window</div>
            <div className="text-muted font-display">
              {tournament.check_in_duration} minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTournamentGeneralInfo;
