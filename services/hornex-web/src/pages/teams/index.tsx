import { TeamList } from '@/components/teams/team-list';
import routes from '@/config/routes';
import { AppLayout } from '@/layouts';
import { dataLoader } from '@/lib/api';
import {
  GetTeamsOutput,
  getTeamsSchemaOutput as schema,
} from '@/services/hx-core/get-teams';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { useData: getTeams } = dataLoader<GetTeamsOutput>('getTeams');

const TeamsPage = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  const route = useRouter();
  const { data: { teams } = {}, error } = getTeams({
    game: 'league-of-legends',
    platform: 'pc',
  });

  console.log(teams, error);

  if (!teams) {
    return <>loading</>;
  }

  return (
    <div className="mx-auto h-full space-y-8 p-8">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white  sm:text-2xl">
          Meus times
        </h2>
      </div>

      <div className="h-[100vh]">
        <div id="teams" className="">
          <div className="grid gap-5">
            {teams && <TeamList teams={teams} />}
          </div>
        </div>
      </div>
    </div>
  );
};

TeamsPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};

export default TeamsPage;
