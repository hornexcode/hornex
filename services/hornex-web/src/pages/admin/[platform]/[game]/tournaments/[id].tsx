import {
  openRegistrationHandler,
  useOpenRegistrationHandler,
} from './admin-tournament-details.handlers';
import TournamentStatusStepper from '@/components/admin/molecules/tournament-status-stepper/tournament-status-stepper';
import Button from '@/components/ui/atoms/button';
import { Switch } from '@/components/ui/switch';
import { useConfig } from '@/contexts/config';
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

  const tournamentStep = getStatusStep(initialTournament || tournament);
  const { config } = useConfig({ name: 'test_mode' });

  const onOpenRegistrationHandler = async () => {
    setLoading(true);
    const { data, error } = await openRegistrationHandler({
      tournamentId: tournament.id,
    });
    if (data && !error) setTournament(data);
    setLoading(false);
  };

  const renderStatusContent = () => {
    switch (tournament.status) {
      case 'draft':
        return (
          <>
            <p className="text-title py-2 font-normal">
              Registration start date:{' '}
              <span className="font-bold">
                {moment(tournament.registration_start_date).format('YYYY-MM-D')}
              </span>
              <div className="text-xs font-semibold">
                date format: (year-month-day)
              </div>
            </p>
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
      case 'registration_open':
        return (
          <>
            <p className="text-title py-2 font-normal">
              The tournament registration will finish at{' '}
              <span className="font-bold">
                {moment(tournament.registration_end_date).format('YYYY-MM-D')}
              </span>
              <div className="text-xs font-semibold">
                date format: (year-month-day)
              </div>
              .
            </p>
            <Button shape="rounded" disabled className="mt-4" size="mini">
              Close registration
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
          <div className="text-body border-light-dark flex border-t">
            <div className="border-light-dark border-r p-3">
              <div className="">Start date</div>
              <div className="text-title font-normal">
                {getStartAt(tournament)}
              </div>
            </div>
            <div className="border-light-dark border-r p-3">
              <div className="">Teams registered</div>
              <div className="text-title font-normal">
                {tournament.teams.length}/{tournament.max_teams}
              </div>
            </div>

            <div className="border-light-dark border-r p-3">
              <div className="">Classification</div>
              <div className="text-title font-normal">
                {getClassifications(tournament)}
              </div>
            </div>
            <div className="border-light-dark border-r p-3">
              <div className="">Entry Fee</div>
              <div className="text-title font-normal">
                {getEntryFee(tournament)}
              </div>
            </div>
            <div className="border-light-dark border-r p-3">
              <div className="">Prize Pool</div>
              <div className="text-title font-normal">
                {getPotentialPrizePool(tournament)}
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
              step {tournamentStep[0]} / {tournamentStep[1]}
            </div>
          </div>
          <TournamentStatusStepper
            steps={tournamentStep[1]}
            currentStep={tournamentStep[0]}
          />
          {renderStatusContent()}
        </div>
      </div>

      {/* prize pool */}
      <div className={clsx(!tournament.prize_pool_enabled && 'hidden')}>
        <h4 className="text-title mb-3 text-lg font-bold">Prize Pool</h4>
        <div className="text-title border-light-dark block rounded border p-4">
          <div>
            <p className="font-bold">Prize pool</p>
            <p className="font-normal">
              The prize pool is the total amount of money that will be given to
              the winners of the tournament.
            </p>
            <ul className="p-3">
              <li className="text-title font-semibold">1st place: $1000.00</li>
              <li className="text-title font-semibold">2nd place: $500.00</li>
              <li className="text-title font-semibold">3rd place: $250.00</li>
              <li className="text-title font-semibold">4rd place: $150.00</li>
            </ul>
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
