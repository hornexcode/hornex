'use client';

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';


import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Tournament = {
  id: string;
  prize_pool: number;
  phase: 'registration_open' | 'results_tracking' | 'payment_pending';
  name: string;
};

export const columns: ColumnDef<Tournament>[] = [
  {
    accessorKey: 'phase',
    header: 'Phase',
    cell: ({ row }) => {
      return (
        <Badge variant={'secondary'}>
          {row.getValue('phase')}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'prize_pool',
    header: () => <div className="text-right">Potential prize pool</div>,
    cell: ({ row }) => {
      const potentialPrizePool = parseFloat(
        row.getValue('prize_pool')
      );
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(potentialPrizePool);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const tournament = row.original;
      const { push } = useRouter();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(tournament.id)}
            >
              Copy payment ID 
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer {row.getValue('id')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => push(`/tournaments/${tournament.id}`)}>
              View tournament details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
