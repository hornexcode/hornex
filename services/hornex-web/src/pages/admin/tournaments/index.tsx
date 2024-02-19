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
import { Tournament, tournament } from '@/lib/models';
import { dataLoader } from '@/lib/request';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

const { useData: useTournaments } = dataLoader<Tournament[], {}>(
  'listTournaments'
);

type TournamentItemProps = {
  tournament: Tournament;
  onClick: (id: string) => void;
};

type TournamentListProps = {
  tournaments: Tournament[];
  onClick: (id: string) => void;
};

const TournamentItem: FC<TournamentItemProps> = ({ tournament, onClick }) => {
  return (
    <tr onClick={() => onClick(tournament.id)}>
      <td>{tournament.name}</td>
      <td>{tournament.description}</td>
      <td>{tournament.start_date}</td>
      <td>{tournament.end_date}</td>
    </tr>
  );
};

const TournamentList: FC<TournamentListProps> = ({ tournaments, onClick }) => (
  <table>
    {tournaments.map((tournament) => (
      <TournamentItem
        key={tournament.id}
        tournament={tournament}
        onClick={onClick}
      />
    ))}
  </table>
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
      <TournamentListTable tournaments={[]} />
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
