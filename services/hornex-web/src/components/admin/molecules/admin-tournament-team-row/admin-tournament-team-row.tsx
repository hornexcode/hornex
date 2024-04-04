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
    <div className="bg-dark border-border mb-2 grid grid-cols-12 rounded-lg border">
      <div className="col-span-1 flex items-center justify-center">
        <Users2 className=" h-7 w-7" />
      </div>

      <div className="border-border col-span-4 flex items-center border-l p-6">
        <h4 className="text-title text-lg">{registration.team.name}</h4>
      </div>

      <div className="col-span-7 ml-auto p-6">
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
