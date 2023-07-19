'use client';
import Link from 'next/link';

import { TournamentListItem } from '@/components/tournaments/tournament-list-item';

import TV4 from '@/assets/images/tournaments/tournament-v4.jpg';
import { LolIcon, LolLogoIcon } from '@/components/ui/icons';
import Button from '@/components/ui/button/button';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import routes from '@/config/routes';

type GamePageProps = {
  params: {
    gameSlug: string;
  };
};

export default function GamePage({ params }: GamePageProps) {
  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-[url('http://localhost:3000/images/jinks.jpg')] bg-cover bg-no-repeat">
        <div className="h-full w-full bg-dark/90"></div>
      </div>
      <div className="-z-20 mx-auto space-y-8">
        <section className="relative flex flex-wrap justify-between gap-6 p-8">
          <div className=" left-8 top-8 flex items-center gap-6">
            <LolIcon className="h-12 fill-white" />
            {/* <LolLogoIcon className="h-16 fill-white" /> */}
            <h1 className="leading-1 font-satoshi p4 rounded-lg text-2xl font-extrabold -tracking-wider text-white md:text-4xl">
              League of Legends
            </h1>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <Button
              className="group flex h-[44px] cursor-pointer items-center justify-center rounded-lg bg-slate-800 text-center shadow-lg transition-all hover:bg-slate-700"
              color="primary"
              shape="rounded"
            >
              <div className="flex items-center gap-3 text-base font-bold leading-3 tracking-tight text-white">
                <ArrowDownTrayIcon className="h-4" />
                Download Game
              </div>
            </Button>
            <Button
              className="group flex h-[44px] cursor-pointer items-center justify-center rounded-lg bg-slate-800 text-center shadow-lg transition-all hover:bg-slate-700"
              color="primary"
              shape="rounded"
            >
              <div className="flex items-center gap-3 text-base font-bold leading-3 tracking-tight text-white">
                <LolIcon className="h-4 fill-white" />
                Connect Game ID
              </div>
            </Button>
          </div>
        </section>

        <section id="tournaments" className="px-8">
          <div className="mb-4 border-b border-slate-800 pb-2">
            <h4 className="text-left text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
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
