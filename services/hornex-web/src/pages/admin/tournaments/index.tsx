import Button from '@/components/ui/atoms/button';
import { AppLayout } from '@/layouts';
import { useRouter } from 'next/router';
import React from 'react';

function DashboardPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto pt-8">
      <div className="text-title font-title text-3xl font-bold">
        Tournament Organizer Admin
      </div>
      <div>
        <Button
          onClick={() => {
            router.push('/organizer/tournaments/create');
          }}
          shape="rounded"
          size="mini"
          className="mt-4"
        >
          Create Tournament
        </Button>
      </div>
    </div>
  );
}

DashboardPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default DashboardPage;
