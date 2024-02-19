import Button from '@/components/ui/atoms/button';
import { TournamentLayout } from '@/layouts/tournament';
import { Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { Edit2Icon } from 'lucide-react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React from 'react';

const { fetch: getTournament } = dataLoader<Tournament>('getTournament');

export type TournamentDetailsProps = {
  tournament: Tournament;
};

const TournamentDetails = ({
  pageProps: { tournament },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="container mx-auto pt-8">
      <div className="flex items-center">
        <h1 className="text-title text-xl font-bold">{tournament.name}</h1>
        <Button className="ml-auto" size="mini">
          <div className="flex items-center">
            <Edit2Icon size={16} className="mr-2" />
            Edit
          </div>
        </Button>
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
  const { data: tournament, error } = await getTournament(
    { game: game, platform, tournamentId: id },
    req
  );
  console.log(error);

  if (!tournament || error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageProps: {
        tournament,
      },
    },
  };
}) satisfies GetServerSideProps<{
  pageProps: TournamentDetailsProps;
}>;
export default TournamentDetails;
