'use client';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

import TV4 from '@/assets/images/tournaments/tournament-v4.jpg';
import { TournamentListItem } from '@/components/tournaments/tournament-list-item';
import Button from '@/components/ui/button/button';
import { LolIcon, LolLogoIcon } from '@/components/ui/icons';
import routes from '@/config/routes';
import { AppLayout } from '@/layouts';

type GamePageProps = {
  params: {
    gameSlug: string;
  };
};

function GamePage({ params }: GamePageProps) {
  return (
    <>
      <div className="mx-auto h-[100vh] space-y-8">
        <section id="tournaments" className="mt-12 px-8">
          <div className="mb-4 border-b border-slate-800 pb-2">
            <h4 className="text-left font-display text-xl font-bold leading-4 text-white lg:text-xl">
              Tournaments
            </h4>
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
        </section>
      </div>
    </>
  );
}

GamePage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default GamePage;
