import AdminTournamentTabNav from '@/components/admin/organisms/admin-tournament-tab-nav';
import { ArrowLongLeftIcon } from '@/components/ui/atoms/icons';
import routes from '@/config/routes';
import { AdminTournamentContextProvider } from '@/contexts';
import { AppLayout } from '@/layouts';
import { getPotentialPrizePool, Tournament } from '@/lib/models/Tournament';
import { dataLoader } from '@/lib/request';
import { toCurrency } from '@/lib/utils';
import clsx from 'clsx';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import React from 'react';

const { fetch: getServerTournament } = dataLoader<Tournament>('getTournament');

export type TournamentDetailsProps = {
  tournament: Tournament;
};

const TournamentDetails = ({
  pageProps: { tournament },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <AdminTournamentContextProvider tournament={tournament}>
      <div className="container mx-auto space-y-8 pt-8">
        {/* General info */}
        <Link
          href={routes.admin.tournaments}
          className="text-title flex items-center"
        >
          <ArrowLongLeftIcon className="mr-2 w-5" />
          Back
        </Link>
        <div className="flex items-center pb-4">
          <h1 className="text-title text-xl font-bold">{tournament.name}</h1>
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
                  <span className="font-display">
                    {toCurrency(getPotentialPrizePool(tournament) * 0.15)}
                  </span>
                </p>
              </div>
            </div>
            {/* 4st place */}
            <div className="text-title border-light-dark border-r border-t p-3">
              <div>
                <p className="font-bold">#4st place</p>
                <p className="font-normal">
                  {tournament.currency}{' '}
                  <span className="font-display">
                    {toCurrency(getPotentialPrizePool(tournament) * 0.1)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTournamentContextProvider>
  );
};

TournamentDetails.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = (async ({
  query: { game, platform, id },
  req,
}) => {
  console.log(id);
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
