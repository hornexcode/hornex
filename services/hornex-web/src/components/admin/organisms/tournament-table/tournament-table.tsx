import { TournamentTableProps } from './tournament-table.types';
import TournamentTableRow from '@/components/admin/molecules/tournament-table-row';
import clsx from 'clsx';
import React, { FC } from 'react';

const TournamentTable: FC<TournamentTableProps> = ({
  className,
  tournaments,
}) => {
  return (
    <div className={clsx('space-y-3', className)}>
      {tournaments.map((tournament, key) => (
        <TournamentTableRow key={key} tournament={tournament} />
      ))}
    </div>
  );
};

export default TournamentTable;
