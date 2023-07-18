'use client';
import Link from 'next/link';

import TV4 from '@/assets/images/tournaments/tournament-v4.jpg';
import { TournamentListItem } from '@/components/tournaments/tournament-list-item';

type HomePage = {
  params: {
    gameSlug: string;
  };
};

export default function HomePage({ params }: HomePage) {
  return (
    <div className="mx-auto space-y-12 p-8">
      <div className="border-b border-slate-800 pb-2">
        <h4 className="text-left text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
          News
        </h4>
      </div>

      {/* News */}
      <section id="news" className="pb-8">
        <div className="grid h-[640px] grid-cols-1 gap-4 rounded-lg md:h-[340px] md:grid-cols-2">
          <Link
            href={''}
            className="group relative h-full w-full overflow-hidden rounded-lg "
          >
            <figure className="flex h-full w-full flex-col justify-end rounded-lg bg-[url('http://localhost:3000/images/tournament-news.png')] bg-cover bg-no-repeat transition-transform group-hover:scale-105"></figure>
            <figcaption className="absolute bottom-0 flex h-full flex-col items-start justify-end  bg-gradient-to-t from-light-dark/70 from-20% to-transparent p-6">
              <h4 className="mb-4 text-3xl font-extrabold leading-7 -tracking-wider text-white">
                LOL: New platform for tournaments
              </h4>
              <span className="text-sm text-gray-400">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Repellendus, suscipit.
              </span>
            </figcaption>
          </Link>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href={''}
              className="group relative h-full w-full overflow-hidden rounded-lg"
            >
              <figure className="flex h-full w-full flex-col justify-end rounded-lg bg-[url('http://localhost:3000/images/jinks.jpg')] bg-cover bg-no-repeat transition-transform group-hover:scale-105"></figure>
              <figcaption className="absolute bottom-0 bg-gradient-to-t from-light-dark/70 from-70% to-transparent p-6">
                <h4 className="text-lg font-extrabold leading-4 -tracking-wider text-white">
                  LOL: New platform for tournaments
                </h4>
              </figcaption>
            </Link>
            <Link
              href={''}
              className="group relative h-full w-full overflow-hidden rounded-lg"
            >
              <figure className="flex h-full w-full flex-col justify-end rounded-lg bg-[url('http://localhost:3000/images/sion.jpg')] bg-cover bg-no-repeat transition-transform group-hover:scale-105"></figure>
              <figcaption className="absolute bottom-0 bg-gradient-to-t from-light-dark/70 from-70% to-transparent p-6">
                <h4 className="text-lg font-extrabold leading-4 -tracking-wider text-white">
                  LOL: New platform for tournaments
                </h4>
              </figcaption>
            </Link>
            <Link
              href={''}
              className="group relative h-full w-full overflow-hidden rounded-lg"
            >
              <figure className="flex h-full w-full flex-col justify-end rounded-lg bg-[url('http://localhost:3000/images/gangplank.jpg')] bg-cover bg-no-repeat transition-transform group-hover:scale-105"></figure>
              <figcaption className="absolute bottom-0 bg-gradient-to-t from-light-dark/70 from-70% to-transparent p-6">
                <h4 className="text-lg font-extrabold leading-4 -tracking-wider text-white">
                  LOL: New platform for tournaments
                </h4>
              </figcaption>
            </Link>
            <Link
              href={''}
              className="group relative h-full w-full overflow-hidden rounded-lg"
            >
              <figure className="flex h-full w-full flex-col justify-end rounded-lg bg-[url('http://localhost:3000/images/jinks.jpg')] bg-cover bg-no-repeat transition-transform group-hover:scale-105"></figure>
              <figcaption className="absolute bottom-0 bg-gradient-to-t from-light-dark/70 from-70% to-transparent p-6">
                <h4 className="text-lg font-extrabold leading-4 -tracking-wider text-white">
                  LOL: New platform for tournaments
                </h4>
              </figcaption>
            </Link>
          </div>
        </div>
      </section>

      <section id="tournaments" className="">
        <div className="mb-4 border-b border-slate-800 pb-2">
          <h4 className=" text-left text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
            Tournaments
          </h4>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
              <li className="">
                <Link
                  className="divide-y divide-slate-700"
                  href={`/league-of-legends/tournaments/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
                >
                  <TournamentListItem tournament={{ thumbnail: TV4 }} />
                </Link>
              </li>
              <li className="">
                <Link
                  className="divide-y divide-slate-700"
                  href={`/league-of-legends/tournaments/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
                >
                  <TournamentListItem tournament={{ thumbnail: TV4 }} />
                </Link>
              </li>
              <li className="">
                <Link
                  className="divide-y divide-slate-700"
                  href={`/league-of-legends/tournaments/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
                >
                  <TournamentListItem tournament={{ thumbnail: TV4 }} />
                </Link>
              </li>
              <li className="">
                <Link
                  className="divide-y divide-slate-700"
                  href={`/league-of-legends/tournaments/0d6934cc-19ca-4384-ab3b-e6c6406a10d3`}
                >
                  <TournamentListItem tournament={{ thumbnail: TV4 }} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
