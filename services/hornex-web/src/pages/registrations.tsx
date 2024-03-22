import Button from '@/components/ui/atoms/button';
import { Logo } from '@/components/ui/atoms/logo';
import { Skeleton } from '@/components/ui/skeleton';
import { AppLayout } from '@/layouts';
import { Registration } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { BookmarkFilledIcon } from '@radix-ui/react-icons';
import moment from 'moment';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

const { useData: useRegistrationsQuery } =
  dataLoader<Registration[]>('getRegistrations');

type RegistrationsPageProps = {
  registrations?: Registration[];
};

const RegistrationsPage = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  const { data: registrations, error, isLoading } = useRegistrationsQuery({});
  const renderRegistrations = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col space-y-4">
          <RegistrationSkeleton />
          <RegistrationSkeleton />
          <RegistrationSkeleton />
        </div>
      );
    }

    if (registrations && !error) {
      if (registrations.length === 0) {
        return <RegistrationEmptyFeedback />;
      }
      return <RegistrationList registrations={registrations} />;
    }

    return <div>Something went wrong</div>;
  };

  return (
    <div className="container mx-auto space-y-12 pt-12">
      <div>
        <h1 className=" text-3xl font-bold">Registrations</h1>
        <p className="text-body">Here are all the tournament you registered</p>
      </div>
      {renderRegistrations()}
    </div>
  );
};

const RegistrationEmptyFeedback = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <Logo size="lg" className="opacity-20" />
    <h4 className="text-body/40 text-3xl font-bold leading-3">
      No registrations found
    </h4>
    <p className="text-body/40 text-lg">
      You are not registered in any tournament
    </p>
    <Button size="small" shape="rounded">
      Find a tournament
    </Button>
  </div>
);

const RegistrationList: FC<{ registrations: Registration[] }> = ({
  registrations,
}) => {
  return (
    <div className="flex w-full flex-col space-y-2">
      <div className="text-body grid w-full grid-cols-12 font-normal">
        <div className="col-span-6">Tournament</div>
        <div className="col-span-4">Team</div>
        <div className="col-span-2">Start Date</div>
      </div>
      <div className="flex flex-col">
        {registrations.map((registration) => (
          <RegistrationItem registration={registration} key={registration.id} />
        ))}
      </div>
    </div>
  );
};

const RegistrationItem = ({ registration }: { registration: Registration }) => {
  const router = useRouter();
  return (
    <div
      className="border-border grid grid-cols-12 rounded border p-4 shadow-sm transition-all hover:cursor-pointer"
      onClick={() => {
        router.push(
          `/${registration.tournament.platform}/${registration.tournament.game}/tournaments/${registration.tournament.id}`
        );
      }}
    >
      <div className="col-span-6 flex items-center">
        <BookmarkFilledIcon className="mr-4 w-12" />
        <div>
          <div className="text-lg font-medium">
            {registration.tournament.name}
          </div>
          <div className="text-body font-normal">
            {registration.tournament.game}
          </div>
        </div>
      </div>
      <div className="col-span-4 flex items-center">
        <div className=" font-normal">{registration.team.name}</div>
      </div>
      <div className="col-span-2 flex items-center">
        <div className=" font-normal">
          {moment(registration.tournament.start_date).format('MMM Do, YYYY')}
        </div>
      </div>
    </div>
  );
};

const RegistrationSkeleton = () => {
  return <Skeleton className="h-20 w-full rounded"></Skeleton>;
};

RegistrationsPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export const getServerSideProps = (async (ctx) => {
  // const { data: registrations, error } = await getRegistrations({}, ctx.req);
  // console.log(error);
  // if (error || !registrations) {
  //   if (error?.code === 401) {
  //     return {
  //       props: {},
  //       redirect: {
  //         destination: '/signin',
  //       },
  //     };
  //   }

  //   return {
  //     props: {},
  //   };
  // }

  // return {
  //   props: {
  //     registrations,
  //   },
  // };
  return {
    props: {},
  };
}) satisfies GetServerSideProps<RegistrationsPageProps>;

export default RegistrationsPage;
