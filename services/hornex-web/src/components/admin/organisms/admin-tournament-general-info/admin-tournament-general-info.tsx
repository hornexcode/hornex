import TournamentStatusStepper from '../../molecules/tournament-status-stepper';
import Button from '@/components/ui/atoms/button';
import { toast } from '@/components/ui/use-toast';
import { useTournament } from '@/contexts/organizer';
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
import React from 'react';

const AdminTournamentGeneralInfo = () => {
  const { tournament, setTournament } = useTournament();
  const [steps, setSteps] = React.useState(
    getStatusStep((tournament || {}) as Tournament)
  );
  const [loading, setLoading] = React.useState(false);

  if (!tournament) {
    return <p>Failed to load tournament metadata</p>;
  }

  const onOpenRegistrationHandler = async () => {
    setLoading(true);
    const { data, error } = await openRegistrationHandler({
      tournamentId: tournament.id,
    });

    if (data && !error) {
      setTournament(data);
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
      setTournament(data);
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
            <div className="text-title py-2 font-normal">
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
            <div className="text-title py-2 font-normal">
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
            <div className="text-title py-2 font-normal">
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
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <div className="text-body border-light-dark flex flex-wrap items-center">
          <div className="border-light-dark border-r border-t p-3">
            <div className="text-title font-bold">Teams registered</div>
            <div className="text-title font-display text-sm font-normal">
              {tournament.total_participants / tournament.team_size}/
              {tournament.max_teams}
            </div>
          </div>
          <div className="border-light-dark border-r border-t p-3">
            <div className="text-title font-bold">Classification</div>
            <div className="text-title font-display text-sm font-normal">
              {getClassifications(tournament)}
            </div>
          </div>
          <div className="border-light-dark border-r border-t p-3 ">
            <div className="text-title font-bold">Entry Fee</div>
            <div className="text-title font-display text-sm font-normal">
              {getEntryFee(tournament)}
            </div>
          </div>
          <div className="border-light-dark border-r border-t p-3">
            <div className="text-title font-bold">Prize Pool</div>
            <div className="text-title font-display text-sm font-normal">
              {tournament.prize_pool_enabled ? 'Enabled' : 'Disabled'}
              {tournament.prize_pool_enabled &&
                `${tournament.currency} ${toCurrency(
                  getPotentialPrizePool(tournament)
                )}`}
            </div>
          </div>
          <div className="border-light-dark border-r border-t p-3">
            <div className="text-title font-bold">Registration start date</div>
            <div className="text-title font-display text-sm font-normal">
              {datetime(tournament.registration_start_date, { time: false })}
            </div>
          </div>
          <div className="border-light-dark border-r border-t p-3">
            <div className="text-title font-bold">Start date</div>
            <div className="text-title font-display text-sm font-normal">
              {moment(
                new Date(
                  `${tournament.start_date}T${tournament.start_time}+00:00`
                )
              ).format('YYYY-MM-D hh:mm A')}
            </div>
          </div>
          <div className="border-light-dark border-r border-t p-3">
            <div className="text-title font-bold">Check-in window</div>
            <div className="text-title font-display text-sm font-normal">
              {tournament.check_in_duration} minutes
            </div>
          </div>
        </div>
      </div>
      <div className="border-light-dark col-span-1 rounded border p-4">
        <span className="text-title">Tournament status</span>
        <div className="flex items-center justify-between pb-2">
          <span className="font-semibold text-amber-500">
            {getStatus(tournament)}
          </span>
          <div className="bg-title rounded px-2 py-1 text-xs text-gray-500">
            step {steps[0]} / {steps[1]}
          </div>
        </div>
        <TournamentStatusStepper steps={steps[1]} currentStep={steps[0]} />
        {renderStatusContent()}
      </div>
    </div>
  );
};

export default AdminTournamentGeneralInfo;
