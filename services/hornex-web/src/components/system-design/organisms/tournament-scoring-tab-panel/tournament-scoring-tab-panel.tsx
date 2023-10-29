import TournamentScoreTable from '@/components/system-design/molecules/tournament-score-table';
import { Star } from '@/components/ui/icons/star';
import { CoinPriceData } from '@/data/static/coin-market-data';
import { Tournament } from '@/lib/hx-app/types';
import React, { FC } from 'react';

type TournamentScoringTabPanelProps = {
  tournament: Tournament;
};

const COLUMNS = [
  {
    Header: () => <div className="px-1"></div>,
    accessor: 'symbol',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="">
        <Star />
      </div>
    ),
    minWidth: 40,
    maxWidth: 20,
  },
  {
    Header: '#',
    accessor: 'market_cap_rank',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>{value}</div>,
    minWidth: 40,
    maxWidth: 20,
  },
  {
    Header: () => <div className="">Coin Name</div>,
    accessor: 'name',
    // @ts-ignore
    Cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.image}
        <div className="ltr:text-left rtl:text-left">{row.original.name}</div>
      </div>
    ),
    minWidth: 100,
  },
  {
    Header: () => <div className="">Price</div>,
    accessor: 'current_price',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="ltr:text-left rtl:text-left">${value}</div>
    ),
    minWidth: 80,
    maxWidth: 120,
  },
  {
    Header: () => <div className="">1h%</div>,
    accessor: 'price_change_percentage_1h_in_currency',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div
        className={`${
          Math.sign(value) === 1 ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {Math.sign(value) === 1 ? '+' : ''}
        {value}%
      </div>
    ),
    maxWidth: 80,
  },
  {
    Header: () => <div className="">24h%</div>,
    accessor: 'price_change_percentage_24h_in_currency',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div
        className={`${
          Math.sign(value) === 1 ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {Math.sign(value) === 1 ? '+' : ''}
        {value}%
      </div>
    ),
    maxWidth: 80,
  },
  {
    Header: () => <div className="">Circulating Supply</div>,
    accessor: 'circulating_supply',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="ltr:text-left rtl:text-left">${value}</div>
    ),
    minWidth: 200,
    maxWidth: 300,
  },
  {
    Header: () => <div className="">Volume (24h)</div>,
    accessor: 'total_volume',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="ltr:text-left rtl:text-left">${value}</div>
    ),
    minWidth: 100,
    maxWidth: 300,
  },
];

const TournamentScoringTabPanel: FC<TournamentScoringTabPanelProps> = ({
  tournament,
}) => {
  const data = React.useMemo(() => CoinPriceData, []);
  const columns = React.useMemo(() => COLUMNS, []);

  return (
    <div className="bg-light-dark rounded-lg shadow-md">
      <div className="border-b-2 border-gray-800 p-5">
        <h4 className="leading-2 text-sm font-medium uppercase text-gray-200">
          Score
        </h4>
      </div>
      <TournamentScoreTable columns={columns} data={data} />
    </div>
  );
};

export default TournamentScoringTabPanel;
