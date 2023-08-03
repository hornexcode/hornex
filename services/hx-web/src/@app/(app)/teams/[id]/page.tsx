'use client';

import TeamSearchList from '@/components/teams/team-search-list';
import { ChevronRightIcon, PlusIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Button from '@/components/ui/button/button';

export default function TeamPage() {
  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
          Team Name
        </h2>
      </div>

      <section id="my-teams" className=""></section>
    </div>
  );
}
