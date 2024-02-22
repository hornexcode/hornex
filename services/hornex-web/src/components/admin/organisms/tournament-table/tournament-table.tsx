import { TournamentTableProps } from './tournament-table.types';
import TournamentRow from '@/components/admin/molecules/tournament-row';
import clsx from 'clsx';
import React, { FC } from 'react';

const TournamentTable: FC<TournamentTableProps> = ({
  className,
  tournaments,
}) => {
  return (
    <div className={clsx('space-y-3', className)}>
      {tournaments.map((tournament, key) => (
        <TournamentRow key={key} tournament={tournament} />
      ))}
    </div>
  );
};

export default TournamentTable;
