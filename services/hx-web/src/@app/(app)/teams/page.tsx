'use client';

import TeamSearchList from '@/components/teams/team-search-list';
import { ChevronRightIcon, PlusIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Button from '@/components/ui/button/button';

export default function TeamPage() {
  const teams = [
    {
      id: 1,
      name: 'Alpha',
      matches: 20,
    },
    {
      id: 2,
      name: 'Bravo',
      matches: 18,
    },
    {
      id: 3,
      name: 'Charlie',
      matches: 23,
    },
    {
      id: 4,
      name: 'Delta',
      matches: 15,
    },
    {
      id: 5,
      name: 'Echo',
      matches: 25,
    },
  ];

  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
          My Teams
        </h2>

        <div className="flex items-center gap-2">
          <TeamSearchList onSelect={() => console.log()} />

          <Link href={'teams/create'} className="block">
            <Button
              className="group flex min-w-[12rem] cursor-pointer items-center justify-center rounded-lg bg-slate-800 text-center shadow-lg transition-all hover:bg-slate-700"
              color="primary"
              shape="rounded"
            >
              <div className="flex items-center gap-3 text-base font-bold leading-3 tracking-tight text-white">
                <PlusIcon className="h-4 fill-white" />
                Create team
              </div>
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <div className="mb-3 hidden grid-cols-3 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid lg:grid-cols-5">
          <span className="px-6 py-4 text-sm tracking-wider text-gray-500 dark:text-gray-300">
            Team
          </span>
          <span className="px-6 py-4 text-sm tracking-wider text-gray-500 dark:text-gray-300">
            Matches
          </span>
          <span className="px-6 py-4 text-sm tracking-wider text-gray-500 dark:text-gray-300"></span>
        </div>

        {teams.map((team) => (
          <div
            key={team.id}
            className="relative mb-3 overflow-hidden rounded-lg bg-white shadow-card transition-all last:mb-0 hover:shadow-large dark:bg-light-dark"
          >
            <div className="relative grid h-auto items-center gap-3 py-4 sm:h-20 sm:grid-cols-3 sm:gap-6 sm:py-0 lg:grid-cols-5">
              <div className="px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm">
                {team.name}
              </div>
              <div className="px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm">
                {team.matches}
              </div>
              <div className="hidden lg:block"></div>
              <div className="hidden lg:block"></div>
              <div className="justify-self-end text-xs font-medium tracking-wider text-black dark:text-white sm:text-sm">
                <Link
                  href={`teams/${team.id}`}
                  className="inline-flex items-center justify-center gap-1 rounded-lg px-5 py-3 text-center text-base font-medium text-gray-900 transition-all hover:translate-x-1 dark:text-slate-400 hover:dark:text-white"
                >
                  manage
                  <ChevronRightIcon className="w-5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
