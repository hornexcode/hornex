'use client';

import TeamSearchList from '@/components/teams/team-search-list';
import { ChevronRightIcon, PlusIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Button from '@/components/ui/button/button';
import InputLabel from '@/components/ui/form/input-label';
import Input from '@/components/ui/form/input';
import UserSearchList from '@/components/users/user-search-list';

export default function CreateTeamPage() {
  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
          Create Team
        </h2>
      </div>

      <div className="space-y-4">
        <div className="block">
          <InputLabel title="Team name" important />
          <Input placeholder="Enter team name" />
        </div>

        {/* TODO: Implement user search */}
        {/*
          <div className="block">
            <InputLabel title="Add user" important />
            <UserSearchList onSelect={() => console.log('')} />
          </div>
        */}

        <div className="block">
          <InputLabel title="Add team member" important />
          <Input placeholder="Enter member username" />
          <Button color="info" shape="rounded" className="mt-4">
            Add user
          </Button>
        </div>
      </div>
    </div>
  );
}
