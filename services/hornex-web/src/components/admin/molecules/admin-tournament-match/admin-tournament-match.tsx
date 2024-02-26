import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import Button from '@/components/ui/atoms/button';
import Image from 'next/image';
import React from 'react';

const AdminTournamentMatch = () => {
  return (
    <div className="bg-light-dark flex items-center justify-center rounded p-4">
      <div id="team-1">
        <div className="flex items-center justify-center space-x-4">
          <Button size="mini">Team 1 winner</Button>
          <span className="text-xl font-bold text-white">Team 1</span>
          <Image alt="hornex-logo" src={HornexLogo} width={32} height={32} />
          <div id="score" className="text-title text-3xl font-extrabold">
            0
          </div>
        </div>
      </div>
      <div className="text-title px-4 font-bold">-</div>
      <div id="team-2">
        <div className="flex items-center justify-center space-x-4">
          <div id="score" className="text-title text-3xl font-extrabold">
            0
          </div>
          <Image alt="hornex-logo" src={HornexLogo} width={32} height={32} />
          <span className="text-xl font-bold text-white">Team 1</span>
          <Button size="mini">Set winner</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminTournamentMatch;
