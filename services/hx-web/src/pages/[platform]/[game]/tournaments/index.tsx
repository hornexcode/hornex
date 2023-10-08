import TournamentsPageTemplate from '@/components/templates/tournaments-page-template/tournaments-page-template';
import { AppLayout } from '@/layouts';
import { requestFactory } from '@/lib/api';
import { GetTournamentsResponse } from '@/lib/hx-app/types/rest/get-tournaments';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const { useData: getTournaments } =
  requestFactory<GetTournamentsResponse>('getTournaments');

const Tournaments = ({
  props,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: tournaments, error, isLoading } = getTournaments();

  return (
    <div className="">
      {error && <div className="text-red-500">{error.message}</div>}
      {/* TODO: add switch to render different types of tournament template */}
      <TournamentsPageTemplate
        isLoading={isLoading}
        tournaments={
          tournaments || { count: 0, next: null, previous: null, results: [] }
        }
      />
    </div>
  );
};

Tournaments.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  query: { game, platform },
}) => {
  // TODO: add ssr for tournaments based on game slug
  return {
    props: { game, platform },
  };
};

export default Tournaments;
