import TournamentLeaderBoardTable from '@/components/ui/molecules/tournament-leader-board-table';
import { CoinPriceData } from '@/data/static/coin-market-data';
import { Tournament } from '@/lib/models';
import React, { FC } from 'react';

type TournamentStandingTabPanelProps = {
  tournament: Tournament;
};

const COLUMNS = [
  {
    Header: '#',
    accessor: 'rank',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>{value}</div>,
    minWidth: 40,
    maxWidth: 20,
  },
  {
    Header: () => <div className="">Team Name</div>,
    accessor: 'name',
    // @ts-ignore
    Cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="text-left">{row.original.name}</div>
      </div>
    ),
    minWidth: 100,
  },

  {
    Header: () => <div className="">Wins</div>,
    accessor: 'wins',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="text-green-500">{value}</div>
    ),
    maxWidth: 80,
  },
  {
    Header: () => <div className="">Losses</div>,
    accessor: 'price_change_percentage_24h_in_currency',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div className="text-red-500">{value}</div>,
    maxWidth: 80,
  },
  // {
  //   Header: () => <div className="">Details</div>,
  //   accessor: 'circulating_supply',
  //   // @ts-ignore
  //   Cell: ({ cell: { value } }) => <div className="text-left">${value}</div>,
  //   minWidth: 200,
  //   maxWidth: 300,
  // },
  // {
  //   Header: () => <div className="">Volume (24h)</div>,
  //   accessor: 'total_volume',
  //   // @ts-ignore
  //   Cell: ({ cell: { value } }) => <div className="text-left">${value}</div>,
  //   minWidth: 100,
  //   maxWidth: 300,
  // },
];

export const TournamentStandingTabPanel: FC<
  TournamentStandingTabPanelProps
> = ({ tournament }) => {
  const data = React.useMemo(() => CoinPriceData, []);
  const columns = React.useMemo(() => COLUMNS, []);

  return (
    <div className="bg-medium-dark rounded shadow-md">
      <div className="border-b border-gray-700 p-4">
        <h4 className="leading-2 text-title text-sm font-bold">leader board</h4>
      </div>
      <TournamentLeaderBoardTable columns={columns} data={data} />
    </div>
  );
};
