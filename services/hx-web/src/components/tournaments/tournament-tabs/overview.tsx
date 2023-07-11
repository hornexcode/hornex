import classnames from "classnames";

import Card from "@/components/ui/card";
import { PodiumIcon, MedalIcon, TeamIcon } from "@/components/ui/icons";
import {
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  FlagIcon,
  MapPinIcon,
  ServerStackIcon,
  TrophyIcon,
} from "@heroicons/react/20/solid";
import Tag from "@/components/ui/tag";

interface OverviewProps {
  classNames?: string;
}

export const Overview: React.FC<OverviewProps> = ({ classNames }) => {
  const countries = [
    { flag: "🇦🇷", name: "Argentina" },
    { flag: "🇧🇴", name: "Bolivia" },
    { flag: "🇧🇷", name: "Brazil" },
    { flag: "🇨🇱", name: "Chile" },
    { flag: "🇨🇴", name: "Colombia" },
    { flag: "🇪🇨", name: "Ecuador" },
    { flag: "🇵🇪", name: "Peru" },
  ];

  return (
    <div className={classnames("m-auto flex", classNames)}>
      <div className="block w-full divide-y divide-slate-800">
        <div className="prize py-8">
          <h2 className="mb-8 text-lg font-bold leading-3 -tracking-wider text-white">
            Prize Pool
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="relative flex items-center justify-between rounded-lg bg-light-dark p-8">
              <div className="absolute left-0 h-full w-[20%] rounded-l-lg bg-gradient-to-r from-orange-400/10 from-10% to-transparent"></div>
              <div className="absolute left-0 h-[50px] w-1 bg-orange-300"></div>
              <div className="flex items-center">
                <p className="prize_label text-[48px] font-extrabold leading-6 text-orange-400">
                  1
                </p>
                <span className="font-medium uppercase text-white">ST</span>
              </div>
              <span className="font-bold text-white">$800 BRL</span>
            </div>
            <div className="relative flex items-center justify-between rounded-lg bg-light-dark p-8">
              <div className="absolute left-0 h-full w-[20%] rounded-l-lg bg-gradient-to-r from-white/10 from-10% to-transparent"></div>
              <div className="absolute left-0 h-[50px] w-1 bg-white "></div>
              <div className="flex items-center">
                <p className="prize_label text-[48px] font-extrabold leading-6 text-white">
                  2
                </p>
                <span className="font-medium uppercase text-white">ND</span>
              </div>
              <span className="font-bold text-white">$400 BRL</span>
            </div>
            <div className="relative flex items-center justify-between rounded-lg bg-light-dark p-8">
              <div className="absolute left-0 h-full w-[20%] rounded-l-lg bg-gradient-to-r from-sky-400/10 from-10% to-transparent"></div>
              <div className="absolute left-0 h-[50px] w-1 bg-sky-400 "></div>
              <div className="flex items-center">
                <p className="prize_label text-[48px] font-extrabold leading-6 text-sky-400">
                  3
                </p>
                <span className="font-medium uppercase text-sky-400">RD</span>
              </div>
              <span className="font-bold text-white">$400 BRL</span>
            </div>
          </div>
        </div>
        {/* game & region */}
        <div className="block pb-6">
          <p className="text-sm text-gray-400">Game & Region</p>
          <p className="text-lg font-extralight -tracking-wider text-white lg:text-2xl">
            League Of Legends
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {countries.map((country) => (
              <Tag key={country.name}>
                <div className="flex items-center">
                  <span className="mr-1">{country.flag}</span>
                  <span className="text-xs">{country.name}</span>
                </div>
              </Tag>
            ))}
          </div>
        </div>

        {/* date & time */}
        <div className="block py-6">
          <div className="flex space-x-2 text-gray-400">
            <p className="text-sm">Date & Time</p>
            <CalendarDaysIcon className="w-3.5" />
          </div>

          <div className="flex items-center text-lg font-extralight -tracking-wider text-white lg:text-2xl">
            <div className="flex items-center">Jun, 12th 2023</div>
          </div>
          <p className="mt-2 text-white">8:00 PM -03</p>
        </div>

        {/* format */}
        <div className="block py-6">
          <p className="text-sm text-gray-400">Format</p>
          <div className="flex items-center text-lg font-extralight -tracking-wider text-white lg:text-2xl">
            <div className="flex items-center">5v5</div>
          </div>
          <p className="mt-2 text-sm text-white">
            Pre-Made Team & Free Agent Registrations are allowed
          </p>
        </div>

        {/* game map & type */}
        <div className="block py-6">
          <p className="text-sm text-gray-400">Game Map & Type</p>
          <div className="flex items-center text-lg font-extralight -tracking-wider text-white lg:text-2xl">
            <div className="flex items-center">Summoners Rift</div>
          </div>
          <p className="mt-2 text-sm text-white">Tournament Draft</p>
        </div>
      </div>
    </div>
  );
};
