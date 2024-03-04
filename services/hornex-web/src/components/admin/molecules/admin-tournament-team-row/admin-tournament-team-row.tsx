import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import Button from '@/components/ui/atoms/button';
import { Registration } from '@/lib/models';
import { Users2, UsersIcon } from 'lucide-react';
import Image from 'next/image';
import React, { FC } from 'react';

type AdminTournamentTeamRowProps = {
  registration: Registration;
};

const AdminTournamentTeamRow: FC<AdminTournamentTeamRowProps> = ({
  registration,
}) => {
  return (
    <div className="bg-medium-dark border-border grid grid-cols-12 border-b">
      <div className="col-span-1 flex items-center justify-center">
        <Users2 className="text-muted h-8 w-8" />
      </div>
      <div className="border-background col-span-4 flex items-center border-l p-6">
        <div className="text-title font-roboto-condensed text-lg">
          {registration.team.name}
        </div>
      </div>
      <div className="ml-auto flex items-center p-6">
        <div className="text-muted ml-4">
          <Button shape="rounded" color="danger" size="mini">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminTournamentTeamRow;
