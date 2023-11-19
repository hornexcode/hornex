import { useModal } from '@/components/modal-views/context';
import { TeamInviteList } from '@/components/ui/organisms/team-invite-list';
import { TeamMemberList } from '@/components/ui/organisms/team-member-list';
import Button from '@/components/ui/atoms/button/button';
import Input from '@/components/ui/atoms/form/input';
import InputLabel from '@/components/ui/atoms/form/input-label';
import { LongArrowLeft } from '@/components/ui/atoms/icons/long-arrow-left';
import Loader from '@/components/ui/atoms/loader';
import UserSearchList from '@/components/users/user-search-list';
import { Team } from '@/domain';
import { AppLayout } from '@/layouts';
import { dataLoader } from '@/lib/api';
import { GetTeamInvitesResponse } from '@/lib/hx-app/types/rest';
import { GetTeamMembersResponse } from '@/lib/hx-app/types/rest/get-team-members';
import { GetTeamOutput } from '@/services/hx-core/get-teams';
import { zodResolver } from '@hookform/resolvers/zod';
import classnames from 'classnames';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

// load members
const { useData: getMembers } =
  dataLoader<GetTeamMembersResponse>('getTeamMembers');
// load invites
const { useData: getInvites } =
  dataLoader<GetTeamInvitesResponse>('getTeamInvites');
// load team
const { fetch: getTeam } = dataLoader<GetTeamOutput>('getTeam');

// delete member
const { delete: deleteTeamMember } = dataLoader<undefined, undefined>(
  'deleteTeamMember'
);

// delete invite
const { delete: cancelInvite } = dataLoader<undefined, undefined>(
  'deleteTeamInvite'
);

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const Member: React.FC<Member> = (member) => {
  return (
    <div className="bg-light-dark shadow-light space-y-4 rounded-lg transition-all hover:cursor-pointer hover:outline sm:p-6"></div>
  );
};

type TeamPageProps = {
  team: Team;
};

const editTeamFormSchema = z.object({
  name: z.string().min(2, { message: 'Minimum 2 characters for team name' }),
});

type EditTeamForm = z.infer<typeof editTeamFormSchema>;

const { put: updateTeam } = dataLoader<undefined, EditTeamForm>('updateTeam');

const TeamPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  team,
}: TeamPageProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { query } = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditTeamForm>({
    resolver: zodResolver(editTeamFormSchema),
  });

  const submitHandler: SubmitHandler<EditTeamForm> = async (form) => {
    setIsSubmitting(true);
    const { error } = await updateTeam({ id: query.id }, form);
    if (!error) {
      toast.success('Team created successfully');
    }
    setIsSubmitting(false);
  };

  React.useEffect(() => {
    setValue('name', team.name);
  }, [team]);

  const { data: teamMembers, mutate: mutateMembers } = getMembers({
    id: team.id,
  });
  const { data: teamInvites, mutate: mutateInvites } = getInvites({
    id: team.id,
    status: 'pending',
  });

  const { openModal } = useModal();

  const cancelInviteHandler = async (id: string) => {
    cancelInvite({ teamId: query.id, id });
    mutateInvites();
  };

  return (
    <div className="mx-auto w-full max-w-[1160px]">
      <div className="flex h-full flex-col items-center p-6">
        <div className="mb-4 self-start">
          {/* link with icon to back */}
          <Link
            href="/teams"
            className="flex items-center text-gray-900 dark:text-gray-200"
          >
            <LongArrowLeft className="h-6 w-6 " />
            <span className="ml-2 text-sm">Voltar</span>
          </Link>
        </div>
        <div className="flex w-full items-start justify-start">
          {/* button to back */}
          <h2 className="text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white  sm:text-2xl">
            Editar
          </h2>
        </div>

        <div className="mt-10 w-full">
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            <div className="flex w-full">
              <div className="w-full">
                <InputLabel title="Nome do time" important />
                <Input
                  inputClassName={classnames(
                    errors.name?.message ? 'focus:ring-red-500' : ''
                  )}
                  placeholder="Nome do time"
                  error={errors.name?.message}
                  {...register('name', { required: true })}
                />
              </div>
            </div>
            <div className="mt-1">
              <Button
                type="submit"
                shape="rounded"
                size="small"
                className="bg-light-dark"
              >
                {isSubmitting ? <Loader /> : 'Alterar'}
              </Button>
            </div>
          </form>
        </div>

        <div className="3 mt-20 w-full">
          <div className="flex items-center justify-between pb-5">
            <h3 className="text-lg font-semibold uppercase text-gray-200">
              Membros
            </h3>
            <div>
              <Button
                onClick={() => openModal('SEARCH_VIEW')}
                shape="rounded"
                variant="solid"
                size="small"
              >
                Add membro
              </Button>
            </div>
          </div>
          <div id="members" className="">
            <div className="flex flex-col">
              <TeamMemberList
                members={teamMembers}
                onRemove={(id) => {
                  deleteTeamMember({ teamId: query.id, id });
                  mutateMembers();
                }}
                team={team}
              />
              <TeamInviteList
                invites={teamInvites}
                onCancel={cancelInviteHandler}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TeamPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data: team, error } = await getTeam(
    {
      teamId: ctx.query.id || '',
    },
    ctx.req
  );

  if (!team) {
    return {
      redirect: {
        destination: '/teams',
        permanent: false,
      },
    };
  }

  return {
    props: {
      team,
    },
  };
};

export default TeamPage;
