import {
  openRegistrationHandler,
  startTournamentHandler,
} from './admin-tournament-details.handlers';
import TournamentStatusStepper from '@/components/admin/molecules/tournament-status-stepper/tournament-status-stepper';
import Button from '@/components/ui/atoms/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { TournamentLayout } from '@/layouts/tournament';
import {
  getClassifications,
  getEntryFee,
  getPotentialPrizePool,
  getStartAt,
  getStatus,
  getStatusStep,
  Tournament,
} from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { combineDateAndTime, toCurrency } from '@/lib/utils';
import { datetime } from '@/utils/datetime';
import clsx from 'clsx';
import moment from 'moment';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React, { useEffect } from 'react';

const { fetch: getServerTournament } = dataLoader<Tournament>('getTournament');
const { useData: getClientTournament } =
  dataLoader<Tournament>('getTournament');

export type TournamentDetailsProps = {
  tournament: Tournament;
};

const TournamentDetails = ({
  pageProps: { tournament: initialTournament, game, platform },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [tournament, setTournament] = React.useState(initialTournament);
  const [loading, setLoading] = React.useState(false);

  const { data: refreshed, error: refreshedError } = getClientTournament({
    game,
    platform,
    tournamentId: tournament.id,
  });

  useEffect(() => {
    if (refreshed && !refreshedError) {
      setTournament(refreshed);
    }
  }, [refreshed]);

  const onOpenRegistrationHandler = async () => {
    setLoading(true);
    const { data, error } = await openRegistrationHandler({
      tournamentId: tournament.id,
    });
    if (data && !error) setTournament(data);
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

  const steps = getStatusStep(initialTournament || tournament);
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
    <div className="container mx-auto space-y-12 pt-8">
      {/* General info */}
      <div className="flex items-center pb-4">
        <h1 className="text-title text-xl font-bold">{tournament.name}</h1>
        <div className="ml-auto flex items-center">
          {/* <Button className="" size="mini">
            <div className="flex items-center">
              <Edit2Icon size={14} className="mr-2" />
              Edit
            </div>
          </Button> */}
          <div className="ml-4 flex items-center">
            <p className="text-title mr-2 font-semibold underline">Test mode</p>
            <Switch checked />
          </div>
        </div>
      </div>

      {/*  */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="text-body border-light-dark flex flex-wrap items-center">
            <div className="border-light-dark border-r border-t p-3">
              <div className="text-title font-bold">Teams registered</div>
              <div className="text-title font-display text-sm font-normal">
                {tournament.teams.length}/{tournament.max_teams}
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
                {tournament.currency}{' '}
                {toCurrency(getPotentialPrizePool(tournament))}
              </div>
            </div>
            <div className="border-light-dark border-r border-t p-3">
              <div className="text-title font-bold">
                Registration start date
              </div>
              <div className="text-title font-display text-sm font-normal">
                {datetime(tournament.registration_start_date, { time: false })}
              </div>
            </div>
            <div className="border-light-dark border-r border-t p-3">
              <div className="text-title font-bold">Registration end date</div>
              <div className="text-title font-display text-sm font-normal">
                {moment(tournament.end_date).format('YYYY-MM-D')}
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

      {/* prize pool */}
      <div className={clsx(!tournament.prize_pool_enabled && 'hidden')}>
        <h4 className="text-title mb-3 text-lg font-bold">Prize Pool</h4>
        <div className="flex">
          {/* 1st place */}
          <div className="text-title border-light-dark border-r border-t p-3">
            <div>
              <p className="font-bold">#1st place</p>
              <p className="font-normal">
                {tournament.currency}{' '}
                {toCurrency(getPotentialPrizePool(tournament) * 0.5)}
              </p>
            </div>
          </div>
          {/* 2st place */}
          <div className="text-title border-light-dark border-r border-t p-3">
            <div>
              <p className="font-bold">#2st place</p>
              <p className="font-normal">
                {tournament.currency}{' '}
                {toCurrency(getPotentialPrizePool(tournament) * 0.25)}
              </p>
            </div>
          </div>
          {/* 3st place */}
          <div className="text-title border-light-dark border-r border-t p-3">
            <div>
              <p className="font-bold">#3st place</p>
              <p className="font-normal">
                {tournament.currency}{' '}
                {toCurrency(getPotentialPrizePool(tournament) * 0.15)}
              </p>
            </div>
          </div>
          {/* 4st place */}
          <div className="text-title border-light-dark border-r border-t p-3">
            <div>
              <p className="font-bold">#4st place</p>
              <p className="font-normal">
                {tournament.currency}{' '}
                {toCurrency(getPotentialPrizePool(tournament) * 0.1)}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* danger zone */}
      <div>
        <h4 className="text-title mb-3 text-lg font-bold">Danger Zone</h4>
        <div className="text-title border-light-dark flex items-center justify-between rounded border p-4">
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

TournamentDetails.getLayout = (page: React.ReactElement) => {
  return <TournamentLayout>{page}</TournamentLayout>;
};

export const getServerSideProps = (async ({
  query: { game, platform, id },
  req,
}) => {
  const { data: tournament, error } = await getServerTournament(
    { game: game, platform, tournamentId: id },
    req
  );

  if (!tournament || error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageProps: {
        tournament,
        game,
        platform,
      },
    },
  };
}) satisfies GetServerSideProps<{
  pageProps: TournamentDetailsProps;
}>;

export default TournamentDetails;
