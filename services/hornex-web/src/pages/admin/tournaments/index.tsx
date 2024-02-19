import TournamentListTable from '@/components/admin/organisms/tournament-list-table';
import Button from '@/components/ui/atoms/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { AppLayout } from '@/layouts';
import { Tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

const { useData: useTournaments } = dataLoader<Tournament[], {}>(
  'listTournaments'
);

function DashboardPage() {
  const { data: tournaments, error, isLoading } = useTournaments({});
  const router = useRouter();

  return (
    <div className="container mx-auto pt-8">
      <div className="text-title font-title text-3xl font-bold">
        Tournament Organizer Admin
      </div>
      <div>
        <Button
          onClick={() => {
            router.push('/admin/tournaments/create');
          }}
          shape="rounded"
          size="mini"
          className="mt-4"
        >
          Create Tournament
        </Button>
      </div>
      <div className="mt-4">
        {!isLoading && tournaments && (
          <TournamentListTable tournaments={tournaments} />
        )}
      </div>
    </div>
  );
}

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

DashboardPage.getLayout = (page: React.ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default DashboardPage;
