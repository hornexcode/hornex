import { zodResolver } from '@hookform/resolvers/zod';
import classnames from 'classnames';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import Button from '@/components/ui/button/button';
import Input from '@/components/ui/form/input';
import InputLabel from '@/components/ui/form/input-label';
import { TeamCreated } from '@/infra/hx-core/responses/team-created';
import { AppLayout } from '@/layouts';
import { dataLoaders } from '@/lib/api';

const createTeamFormSchema = z.object({
  name: z.string().min(2, { message: 'Minimum 2 characters for team name' })
});

type CreateTeamForm = z.infer<typeof createTeamFormSchema>;
const { post: createTeam } = dataLoaders<TeamCreated, CreateTeamForm>(
  'createTeam'
);

const TeamsCreate = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors }
  } = useForm<CreateTeamForm>({
    resolver: zodResolver(createTeamFormSchema)
  });

  const submitHandler = async (data: CreateTeamForm) => {
    try {
      setIsFetching(true);
      const { team } = await createTeam(data);

      toast.success('Team created successfully');

      router.push(`${team.id}`);
    } catch (err) {
      const { error } = err as { error: string };
      toast.error(error);
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left font-display text-xl font-bold leading-4 tracking-tight text-white lg:text-xl">
          New Team
        </h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
        {/* Email */}
        <div>
          <InputLabel title="Team name" important />
          <Input
            disabled={isFetching}
            inputClassName={classnames(
              errors.name?.message ? 'focus:ring-red-500' : ''
            )}
            placeholder="Choose a cool name like: #1 HX 🐐"
            error={errors.name?.message}
            {...register('name', { required: true })}
          />
        </div>
        <Button
          isLoading={isFetching}
          disabled={isFetching}
          color="info"
          size="small"
          shape="rounded"
        >
          Create
        </Button>
      </form>
    </div>
  );
};

TeamsCreate.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      user: {}
    }
  };
};

export default TeamsCreate;
