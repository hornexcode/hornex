import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import routes from '@/config/routes';
import { Team } from '@/domain/team';

type TeamProps = Team;

const Team: FC<TeamProps> = (team) => {
  return (
    <div className="relative overflow-hidden rounded bg-light-dark">
      <div className="absolute top-0 h-full w-full rounded bg-red-400/80 opacity-70 transition-opacity duration-500 ease-linear"></div>

      <Link
        href={`${routes.teams}/${team.id}`}
        className="flex min-h-[14rem] cursor-pointer flex-col items-center justify-center gap-4 rounded bg-slate-800 transition-all hover:bg-slate-700"
      >
        <img className="absolute" src={team.image} alt="team image" />

        <div className="z-10 block">
          <h4 className="font-display text-lg font-extrabold tracking-wide text-white">
            {team.name}
          </h4>
        </div>
      </Link>
    </div>
  );
};

type TeamsListProps = {
  teams: Team[];
};

export const TeamList: FC<TeamsListProps> = ({ teams }) => {
  return teams.map((team) => <Team key={team.id} {...team} />);
};
