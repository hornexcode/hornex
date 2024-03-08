import { TournamentCreateForm } from '@/components/admin/organisms/tournament-create-form/tournament-create-form';
import { AppLayout } from '@/layouts';
import React from 'react';

function TournamentsCreatePage() {
  return (
    <div className="container mx-auto pt-8">
      <div className="text-title mb-4 text-lg font-bold">Create Tournament</div>
      <div className="bg-medium-dark w-2/3 p-8 shadow-lg">
        <TournamentCreateForm />
      </div>
    </div>
  );
}

TournamentsCreatePage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default TournamentsCreatePage;
