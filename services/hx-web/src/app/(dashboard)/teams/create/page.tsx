'use client';

import { FC, useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@/components/ui/button/button';
import InputLabel from '@/components/ui/form/input-label';
import Input from '@/components/ui/form/input';

import classnames from 'classnames';
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';

// const { patch: updateImageMeta } = dataLoaders<PACAdminImage>('adminImageUpdateMeta')

type Member = {
  id: number;
  username: string;
};

const form = z.object({
  username: z.string().min(1, { message: 'Username is required' })
});
type MemberForm = z.infer<typeof form>;

type MemberListItemProps = {
  member: Member;
  onRemoveMember: (id: number) => void;
};

const MemberListItem: FC<MemberListItemProps> = ({
  member,
  onRemoveMember
}) => (
  <li className="flex items-center rounded-lg bg-light-dark p-4">
    <span className="text-white">{member.username}</span>
    <div className="ml-auto">
      <Button
        color="danger"
        size="mini"
        shape="rounded"
        className="ml-auto"
        onClick={() => onRemoveMember(member.id)}
      >
        <div className="flex items-center">
          <TrashIcon className="mr-1 h-4 w-4" /> Remove
        </div>
      </Button>
    </div>
  </li>
);

type MemberListProps = {
  members: Member[];
  onRemoveMember: (id: number) => void;
};

const MemberList: FC<MemberListProps> = ({ members, onRemoveMember }) => {
  return (
    <ul className="space-y-4">
      {members.map((member) => (
        <MemberListItem
          key={member.id}
          member={member}
          onRemoveMember={onRemoveMember}
        />
      ))}
    </ul>
  );
};

export default function CreateTeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [fetching, setFetching] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const removeHandler = (id: number) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
    setIsLimitReached(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<MemberForm>({
    resolver: zodResolver(form)
  });

  const addMember = async (data: MemberForm) => {
    setFetching(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (members.find((member) => member.username === data.username)) {
      setFetching(false);
      reset();
      return;
    }

    if (members.length === 4) {
      setIsLimitReached(true);
    }

    setMembers((prev) => {
      return [
        ...prev,
        {
          id: Math.random() + members.length,
          username: data.username.toLowerCase()
        }
      ];
    });

    reset();
    setFetching(false);
  };

  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
          Create Team
        </h2>

        <div className="flex items-center gap-2">
          <Button
            className="group flex min-w-[12rem] cursor-pointer items-center justify-center rounded-lg bg-sky-400 text-center shadow-lg transition-all hover:bg-sky-500"
            color="primary"
            shape="rounded"
          >
            <div className="flex items-center gap-2 text-base font-bold uppercase leading-3 tracking-tight text-white">
              <PlusIcon className="h-5 fill-white" />
              Create
            </div>
          </Button>
        </div>
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
                disabled={fetching || isLimitReached}
                inputClassName={classnames({
                  'dark:border-red-500': errors.username,
                  'placeholder-red-500': isLimitReached
                })}
                error={errors.username?.message}
                {...register('username', { required: true })}
                placeholder={
                  isLimitReached
                    ? 'Limit of members reached'
                    : 'Enter member username'
                }
              />
            </div>
            <Button
              disabled={isLimitReached}
              isLoading={fetching}
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
            <MemberList members={members} onRemoveMember={removeHandler} />
          </div>
        </div>
      </div>
    </div>
  );
}
