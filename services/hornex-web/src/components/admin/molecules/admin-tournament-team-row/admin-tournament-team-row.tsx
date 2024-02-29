import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import Button from '@/components/ui/atoms/button';
import { Registration } from '@/lib/models';
import Image from 'next/image';
import React, { FC } from 'react';

type AdminTournamentTeamRowProps = {
  registration: Registration;
};

const AdminTournamentTeamRow: FC<AdminTournamentTeamRowProps> = ({
  registration,
}) => {
  return (
    <div className="bg-medium-dark  border-background flex items-center border-b">
      <div className="border-brand border-l-3 flex items-center space-x-4 p-4">
        <Image alt="hornex-logo" src={HornexLogo} width={32} height={32} />
        <div className="text-title font-roboto-condensed text-lg">
          {registration.team.name}
        </div>
      </div>
      <div className="ml-auto flex items-center p-4">
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
