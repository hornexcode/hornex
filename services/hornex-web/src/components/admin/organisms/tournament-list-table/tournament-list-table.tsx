import { TournamentListTableProps } from './tournament-list-table.types';
import TournamentListRow from '@/components/admin/molecules/tournament-table-row';
import clsx from 'clsx';
import React, { FC } from 'react';

const TournamentListTable: FC<TournamentListTableProps> = ({
  className,
  tournaments,
}) => {
  return (
    <div className={clsx('space-y-3', className)}>
      {tournaments.map((tournament, key) => (
        <TournamentListRow key={key} tournament={tournament} />
      ))}
    </div>
  );
};

export default TournamentListTable;
