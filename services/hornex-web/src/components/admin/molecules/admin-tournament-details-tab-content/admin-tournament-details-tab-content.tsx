import AdminTournamentMatches from '../admin-tournament-matches';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAdminTournament } from '@/contexts';
import { Standing } from '@/lib/models/Standing';
import {
  getEntryFee,
  getStatus,
  getStatusStep,
  Tournament,
} from '@/lib/models/Tournament';
import { dataLoader } from '@/lib/request';
import { cn } from '@/lib/utils';
import { UsersIcon } from '@heroicons/react/20/solid';
import { GearIcon } from '@radix-ui/react-icons';
import { DollarSignIcon } from 'lucide-react';
import moment from 'moment';
import React, { useEffect } from 'react';

const { useData: getTournamentResults } = dataLoader<Standing[]>(
  'org:tournament:results'
);
const useGetTournamentResults = ({ id }: { id: string }) =>
  getTournamentResults({ tournamentId: id });

const AdminTournamentGeneralInfo = () => {
  const { tournament } = useAdminTournament();
  const { data: tournamentResults } = useGetTournamentResults({
    id: tournament.id,
  });

  const [steps, setSteps] = React.useState(
    getStatusStep((tournament || {}) as Tournament)
  );
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setSteps(getStatusStep((tournament || {}) as Tournament));
  }, [tournament]);

  if (!tournament) {
    return <p>Failed to load tournament metadata</p>;
  }

  const renderStatusContent = () => {
    switch (tournament.status) {
      case 'announced':
        return (
          <>
            <div className="text-body">
              Start date:{' '}
              <span className="font-bold">
                {moment(tournament.registration_start_date).format(
                  'YYYY-MM-DD HH:mm'
                )}
              </span>
            </div>
          </>
        );
      case 'registering':
        return (
          <>
            <div className="text-body text-sm">
              Finishes at:{' '}
              <span className="font-bold">
                {moment(tournament.registration_start_date).format(
                  'YYYY-mm-d HH:mm'
                )}
              </span>
            </div>
          </>
        );
      case 'running':
        return (
          <>
            <div className="text-body text-sm">in progress</div>
          </>
        );
      case 'ended':
        return (
          <div className="block">
            <div className="text-body text-sm font-normal italic">
              Ended at: {moment(tournament.ended_at).format('YYYY-MM-DD HH:mm')}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="mt-4 grid grid-cols-3 gap-6">
      <div className="col-span-1">
        <Card className="bg-muted/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md text-body font-medium">
              Teams
            </CardTitle>
            <UsersIcon className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tournament.registered_teams.length}/{tournament.max_teams}
            </div>
            <p className="text-body text-sm">Registered teams</p>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1">
        <Card className="bg-muted/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md text-body font-medium">
              Entry fee
            </CardTitle>
            <DollarSignIcon className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tournament.is_entry_free ? 'Free' : getEntryFee(tournament)}
            </div>
            <p className="text-body text-sm">All classifications</p>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1">
        <Card className="bg-muted/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md text-body font-medium">
              Status
            </CardTitle>
            <GearIcon className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{getStatus(tournament)}</div>
              <div className="text-sm text-gray-500">
                step {steps[0]} / {steps[1]}
              </div>
            </div>
            {/* <TournamentStatusStepper steps={steps[1]} currentStep={steps[0]} /> */}
            {renderStatusContent()}
          </CardContent>
        </Card>
      </div>
      <div
        className={cn('col-span-3', tournament.status === 'ended' && 'hidden')}
      >
        <Card className="bg-dark p-6">
          <div className="text-2xl font-bold">Matches</div>
          {tournament.status != 'running' && (
            <p className="text-body">The tournament is not running yet</p>
          )}
          {tournament.status == 'running' && <AdminTournamentMatches />}
        </Card>
      </div>
      {/* danger zone */}
      {/* <div className="col-span-3">
        <h4 className="text-title mb-3 text-lg font-bold">Danger Zone</h4>
        <div className="text-title border-border flex items-center justify-between rounded border p-4">
          <div>
            <p className="font-bold">Delete this tournament</p>
            <p className="font-normal">
              Once you delete a tournament, there is no going back. Please be
              certain.{' '}
            </p>
          </div>
          <Button color="danger" shape="rounded" size="mini">
            Delete
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default AdminTournamentGeneralInfo;
