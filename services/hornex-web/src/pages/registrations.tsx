import { ExpiredLoginButton } from '@/components/ui/atoms/expired-login-button';
import { useTournament } from '@/contexts';
import { AppLayout } from '@/layouts';
import { Registration } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { ListIcon } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React from 'react';

const { useData: useGetTournamentRegistrationsQuery } =
  dataLoader<Registration[]>('getRegistrations');

const RegistrationsPage = () => {
  const {
    data: registrations,
    error,
    isLoading,
  } = useGetTournamentRegistrationsQuery({});

  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="container mx-auto pt-12">
        <ExpiredLoginButton />
      </div>
    );
  }

  if (!registrations && isLoading) {
    return (
      <div className="container mx-auto pt-12">
        <div className="text-title">Loading...</div>
      </div>
    );
  }

  if (error || !registrations) {
    return (
      <div className="container mx-auto pt-12">
        <div className="text-title">Failed to load registrations</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-12 pt-12">
      <div>
        <h1 className="text-title font-roboto-condensed text-3xl">
          Registrations
        </h1>
      </div>
      <div className="flex w-full flex-col space-y-2">
        <div className="text-title grid w-full grid-cols-12 font-normal">
          <div className="col-span-6">Tournament</div>
          <div className="col-span-4">Team</div>
          <div className="col-span-2">Start Date</div>
        </div>
        <div className="flex flex-col">
          {registrations &&
            registrations.map((registration) => (
              <RegistrationRow
                registration={registration}
                key={registration.id}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

const RegistrationRow = ({ registration }: { registration: Registration }) => {
  const router = useRouter();
  return (
    <div
      className="bg-medium-dark border-border grid grid-cols-12 border-b p-4 transition-all hover:cursor-pointer hover:shadow-2xl"
      onClick={() => {
        router.push(
          `/${registration.tournament.platform}/${registration.tournament.game}/tournaments/${registration.tournament.uuid}`
        );
      }}
    >
      <div className="col-span-6 flex items-center">
        <div className="w-auto px-4">
          <ListIcon className="text-title mr-4 w-[64px] px-4" />
        </div>
        <div>
          <div className="font-roboto-condensed text-title text-xl  tracking-wide">
            {registration.tournament.name}
          </div>
          <div className="text-muted">{registration.tournament.game}</div>
        </div>
      </div>
      <div className="col-span-4 flex items-center">
        <div className="text-title text-xl font-normal">
          {registration.team.name}
        </div>
      </div>
      <div className="col-span-2 flex items-center">
        <div className="text-title text-xl font-normal">
          {moment(registration.tournament.start_date).format('MMM Do, YYYY')}
        </div>
      </div>
    </div>
  );
};

RegistrationsPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default RegistrationsPage;
