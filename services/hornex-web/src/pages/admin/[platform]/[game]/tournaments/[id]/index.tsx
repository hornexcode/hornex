import {
  openRegistrationHandler,
  startTournamentHandler,
} from './admin-tournament-details.handlers';
import TournamentStatusStepper from '@/components/admin/molecules/tournament-status-stepper/tournament-status-stepper';
import AdminTournamentTabNav from '@/components/admin/templates/admin-tournament-tab-nav';
import Button from '@/components/ui/atoms/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { useTournament } from '@/contexts/organizer';
import { AppLayout } from '@/layouts';
import { TournamentLayout } from '@/layouts/tournament';
import {
  getClassifications,
  getEntryFee,
  getPotentialPrizePool,
  getStatus,
  getStatusStep,
  Tournament,
} from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { toCurrency } from '@/lib/utils';
import { datetime } from '@/utils/datetime';
import clsx from 'clsx';
import moment from 'moment';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  const [tournament, setTournament] = React.useState(initialTournament);
  const [loading, setLoading] = React.useState(false);

  const { data: refreshed, error: refreshedError } = getClientTournament({
    game,
    platform,
    tournamentId: tournament.id,
  });

  const { setTournament: setContextTournament } = useTournament();

  useEffect(() => {
    setContextTournament(tournament);

    // cleanup
    return () => {
      setContextTournament(undefined);
    };
  }, []);

  useEffect(() => {
    if (refreshed && !refreshedError) {
      setTournament(refreshed);
    }
  }, [refreshed]);

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

      <AdminTournamentTabNav />
      {/*  */}

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
  return <AppLayout>{page}</AppLayout>;
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
