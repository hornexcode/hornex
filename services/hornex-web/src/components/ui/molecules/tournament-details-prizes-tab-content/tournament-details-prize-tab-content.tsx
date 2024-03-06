import { PodiumIcon } from '../../atoms/icons';
import React from 'react';

const TournamentDetailsPrizesTabContent = () => {
  return (
    <div>
      <Prize />
      <Prize />
      <Prize />
    </div>
  );
};

const Prize = () => {
  return (
    <div className="bg-medium-dark border-border grid grid-cols-12 border-b">
      <div className="border-brand col-span-1 flex justify-center  border-l-4 p-4">
        <div className="block">
          <PodiumIcon className="mx-auto w-10" />
        </div>
      </div>
      <div className="col-span-11 p-4">
        <div className="flex items-center justify-between">
          <div className="block">
            <h4 className="text-title text-lg ">1st Place</h4>
          </div>
          <div className="block">
            <h4 className="text-lg font-bold">R$ 1.000,00</h4>
            <span className="text-muted text-sm">1st Place</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TournamentDetailsPrizesTabContent;
