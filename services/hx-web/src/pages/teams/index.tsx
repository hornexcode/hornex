import { TeamList } from '@/components/teams/team-list';
import routes from '@/config/routes';
import { AppLayout } from '@/layouts';
import { dataLoadersV2 } from '@/lib/api';
import {
  GetTeamsOutput,
  getTeamsSchemaOutput as schema,
} from '@/services/hx-core/get-teams';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import * as Cookies from 'es-cookie';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import useSWR from 'swr';

const { useData: getTeams } = dataLoadersV2<GetTeamsOutput>('getTeams', schema);

const TeamsPage = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  const { data: teams, error, isLoading } = getTeams();

  if (!teams || isLoading) {
    return <></>;
  }

  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left font-display text-xl font-bold leading-4 tracking-tight text-white lg:text-xl">
          My Teams
        </h2>
      </div>

      <section id="teams" className="space-y-10">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <Link
              href={routes.createTeam}
              className="flex min-h-[14rem] cursor-pointer flex-col items-center justify-center gap-4 rounded bg-slate-800 p-4 transition-all hover:bg-slate-700"
            >
              <PlusCircleIcon className="w-7" />
              <span className="text-sm font-medium text-slate-400">
                Create new team
              </span>
            </Link>
            <TeamList teams={teams} />
          </div>
        </div>
      </section>
    </div>
  );
};

TeamsPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = Cookies.parse(ctx.req.headers.cookie || '');
  if (
    cookies['hx-auth.token'] !== undefined &&
    cookies['hx-auth.token'] !== ''
  ) {
    return {
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default TeamsPage;
