import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import Button from '@/components/ui/atoms/button';
import Image from 'next/image';
import React from 'react';

const AdminTournamentMatch = () => {
  return (
    <div className="bg-light-dark shadow-card flex flex-col items-center justify-center space-y-4 p-5">
      <div className="bg-title text-background rounded p-1 px-2 text-xs font-normal uppercase">
        Round 1
      </div>
      <div className=" flex items-center justify-center rounded">
        <div id="team-1" className="flex flex-col">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-title text-xl font-bold">Team 1</span>
            <Image alt="hornex-logo" src={HornexLogo} width={32} height={32} />
            <div id="score" className="text-title text-3xl font-extrabold">
              0
            </div>
          </div>
        </div>
        <div className="text-title px-4 font-bold">-</div>
        <div id="team-2" className="flex flex-col">
          <div className="flex items-center justify-center space-x-4">
            <div id="score" className="text-title text-3xl font-extrabold">
              0
            </div>
            <Image alt="hornex-logo" src={HornexLogo} width={32} height={32} />
            <span className="text-title text-xl font-bold">Team 1</span>
          </div>
        </div>
      </div>
      <Button className="mt-4 w-40" shape="rounded" size="mini">
        Finish
      </Button>
      <div className="text-muted">Game Status: In Progress</div>
    </div>
  );
};

export default AdminTournamentMatch;
