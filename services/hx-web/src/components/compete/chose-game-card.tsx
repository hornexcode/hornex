import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import Button from '../ui/button/button';
import { XboxIcon } from '../ui/icons';
import {
  ComputerDesktopIcon,
  CurrencyDollarIcon,
  UsersIcon,
} from '@heroicons/react/20/solid';

type ChoseGameCardProps = {
  bgImage: string;
  hoverImage: StaticImageData;
  LogoComponentIcon: (props: React.SVGAttributes<{}>) => JSX.Element;
};

export const ChoseGameCard: FC<ChoseGameCardProps> = ({
  bgImage,
  LogoComponentIcon,
  hoverImage,
}) => (
  // <div className="rounded-lg bg-light-dark">
  //   <div className="p-4">
  //     <div className="group relative h-full min-h-[16rem] w-full min-w-[18rem] overflow-hidden rounded-lg bg-light-dark/40 bg-[url('http://localhost:3000/images/card-background-lol.png')] bg-cover bg-no-repeat">
  //       <div className="absolute top-0 h-full w-full rounded-lg bg-light-dark/70 opacity-70 transition-opacity duration-500 ease-linear"></div>
  //       <div className="relative top-8 flex h-full flex-col">
  //         <LogoComponentIcon className="mx-auto mt-auto max-w-[40%] fill-white" />
  //         <Image
  //           src={hoverImage}
  //           alt="Lol character"
  //           className="mx-auto mb-4 mt-auto min-w-[70%] transition-transform duration-500"
  //         />
  //       </div>
  //     </div>
  //   </div>
  //   <div className="block px-4">
  //     <h4 className="font-bold leading-4 tracking-tight text-white">
  //       League of Legends
  //     </h4>
  //     <span className="text-xs font-medium">Lorem, ipsum dolor.</span>
  //   </div>
  //   <div className="block p-4">
  //     <div className="flex flex-col justify-between border-t border-slate-800 pt-4">
  //       <p className="text-xs">Platforms</p>
  //       <div className="flex flex-wrap items-center space-x-2">
  //         <XboxIcon className="w-7 rounded-md bg-green-500 fill-white p-1" />
  //         <ComputerDesktopIcon className="w-7 rounded-md bg-sky-500 fill-white p-1" />
  //       </div>
  //     </div>
  //   </div>
  //   <div className="flex justify-between rounded-b-lg border-t border-slate-800 bg-slate-700 p-4">
  //     <div className="text-sm font-bold uppercase tracking-tight text-white">
  //       40 tournaments
  //     </div>
  //     <Button
  //       size="small"
  //       className="bg-gradient-to-r from-sky-400 to-sky-500"
  //       color="info"
  //       shape="rounded"
  //     >
  //       Play Now
  //     </Button>
  //   </div>
  // </div>
  <div className="rounded-lg bg-light-dark shadow-card">
    {/* tournament card header */}
    <div className="p-4">
      <div className="group relative h-full min-h-[12rem] w-full min-w-[18rem] overflow-hidden rounded-lg bg-light-dark/40 bg-[url('http://localhost:3000/images/card-background-lol.png')] bg-cover bg-no-repeat">
        <div className="absolute top-0 h-full w-full rounded-lg bg-sky-400/90 opacity-70 transition-opacity duration-500 ease-linear"></div>
        <div className="relative top-8 flex h-full flex-col">
          <LogoComponentIcon className="mx-auto mt-auto max-w-[40%] fill-white" />
          <Image
            src={hoverImage}
            alt="Lol character"
            className="mx-auto mb-4 mt-auto min-w-[70%] transition-transform duration-500"
          />
        </div>
      </div>

      {/* tournament card body */}
      <div className="mt-4 block space-y-3 divide-y divide-slate-800">
        <div className="block">
          <span className="text-[11px]">12.29 players registered</span>
          <h4 className="text-sm font-extrabold text-white">
            League of Legends - 5v5
          </h4>
        </div>

        <div className="block pt-2">
          <div className="flex flex-col justify-between ">
            <p className="mb-2 text-xs">Platforms</p>
            <div className="flex flex-wrap items-center space-x-2">
              <XboxIcon className="w-7 rounded-md bg-green-500 fill-white p-1" />
              <ComputerDesktopIcon className="w-7 rounded-md bg-sky-500 fill-white p-1" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* tournament card footer */}
    <div className="grid grid-cols-2 space-y-2 rounded-b-lg border-t border-slate-700 bg-slate-800 p-4">
      <div className="flex flex-col justify-center pr-2 text-left">
        <h4 className="font-extrabold uppercase leading-4 tracking-tighter text-white">
          23 Tournaments
        </h4>
        <span className="text-xs">Play for free</span>
      </div>
      <div>
        <Button
          className="w-full bg-gradient-to-r from-sky-400 to-sky-500 -tracking-wider"
          shape="rounded"
          size="small"
        >
          Play Now
        </Button>
      </div>
    </div>
  </div>
);
