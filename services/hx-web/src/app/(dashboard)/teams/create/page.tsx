'use client';

import { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@/components/ui/button/button';
import InputLabel from '@/components/ui/form/input-label';
import Input from '@/components/ui/form/input';

import classnames from 'classnames';
import { TrashIcon } from '@heroicons/react/20/solid';

// const { patch: updateImageMeta } = dataLoaders<PACAdminImage>('adminImageUpdateMeta')

type Member = {
  id: number;
  username: string;
};

const form = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
});
type MemberForm = z.infer<typeof form>;

const MemberListItem = ({ member }: { member: Member }) => (
  <li className="flex items-center rounded-lg bg-light-dark p-4">
    <span className="text-white">{member.username}</span>
    <div className="ml-auto">
      <Button
        color="danger"
        size="mini"
        shape="rounded"
        className="ml-auto"
        onClick={() => console.log('')}
      >
        <div className="flex items-center">
          <TrashIcon className="mr-1 h-4 w-4" /> Remove
        </div>
      </Button>
    </div>
  </li>
);

const MemberList = ({ members }: { members: Member[] }) => {
  return (
    <ul className="space-y-4">
      {members.map((member) => (
        <MemberListItem key={member.id} member={member} />
      ))}
    </ul>
  );
};

export default function CreateTeamPage() {
  // TODO: Max teams member 5
  // TODO: Remove member from member list

  const [members, setMembers] = useState<Member[]>([]);
  const [fetching, setFetching] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberForm>({
    resolver: zodResolver(form),
  });

  const addMember = async (data: MemberForm) => {
    setFetching(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (members.find((member) => member.username === data.username)) {
      return;
    }

    setMembers((prev) => [
      ...prev,
      { id: members.length + 1, username: data.username.toLowerCase() },
    ]);

    reset();
    setFetching(false);
  };

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
          <form onSubmit={handleSubmit(addMember)}>
            <div>
              <InputLabel title="Add team member" important />
              <Input
                disabled={fetching}
                inputClassName={classnames({
                  'dark:border-red-500': errors.username,
                })}
                error={errors.username?.message}
                {...register('username', { required: true })}
                placeholder="Enter member username"
              />
            </div>
            <Button
              isLoading={fetching}
              loaderVariant="moveUp"
              loaderSize="small"
              type="submit"
              color="info"
              size="small"
              shape="rounded"
              className="mt-4"
            >
              Add user
            </Button>
          </form>

          <div className="py-10">
            <MemberList members={members} />
          </div>
        </div>
      </div>
    </div>
  );
}
