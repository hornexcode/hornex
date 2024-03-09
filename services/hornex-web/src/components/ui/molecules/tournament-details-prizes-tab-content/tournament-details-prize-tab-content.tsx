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
      <div className="border-brand col-span-1 flex justify-center  border-l p-4">
        <div className="flex h-full items-center">
          <h4 className="text-title font-roboto text-3xl font-extrabold tracking-tight">
            1st
          </h4>
        </div>
      </div>
      <div className="border-border col-span-11 border-l p-4">
        <div className="flex items-center justify-between">
          <div className="block">
            <h4 className="text-lg font-bold">R$ 1.000,00</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TournamentDetailsPrizesTabContent;
