import { PlusCircleIcon } from '@heroicons/react/20/solid';
import * as Cookies from 'es-cookie';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

import TV4 from '@/assets/images/tournaments/tournament-v4.jpg';
import { TournamentListItem } from '@/components/tournaments/tournament-list-item';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import routes from '@/config/routes';
import { AppLayout } from '@/layouts';

const TournamentsPage = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left text-xl font-bold leading-4 text-white lg:text-xl">
          Tournaments
        </h2>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-12">
          {/* grid-cols-1 gap-4 */}
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4 2xl:grid-cols-5 ">
            <li className="">
              <Link
                className="divide-y divide-slate-700"
                href={`/${routes.platform}/league-of-legends/${routes.tournaments}/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
              >
                <TournamentListItem tournament={{ thumbnail: TV4 }} />
              </Link>
            </li>
            <li className="">
              <Link
                className="divide-y divide-slate-700"
                href={`/${routes.platform}/league-of-legends/${routes.tournaments}/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
              >
                <TournamentListItem tournament={{ thumbnail: TV4 }} />
              </Link>
            </li>
            <li className="">
              <Link
                className="divide-y divide-slate-700"
                href={`/${routes.platform}/league-of-legends/${routes.tournaments}/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
              >
                <TournamentListItem tournament={{ thumbnail: TV4 }} />
              </Link>
            </li>
            <li className="">
              <Link
                className="divide-y divide-slate-700"
                href={`/${routes.platform}/league-of-legends/${routes.tournaments}/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
              >
                <TournamentListItem tournament={{ thumbnail: TV4 }} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

TournamentsPage.getLayout = (page: React.ReactElement) => {
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

export default TournamentsPage;
