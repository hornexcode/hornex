"use client";
import Link from "next/link";

import TV4 from "@/assets/images/tournaments/tournament-v4.jpg";
import { TournamentListItem } from "@/components/tournaments/tournament-list-item";
import {
  ArrowRightCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ComputerDesktopIcon,
  PlusCircleIcon,
  PlusIcon,
  TvIcon
} from "@heroicons/react/20/solid";
import { ChoseGameCard, PlatformPicker } from "@/components/compete";
import Image from "next/image";
import BgChar from "@/assets/images/lol-bg-char.png";
import { LolLogoIcon } from "@/components/ui/icons";

export default function Compete() {
  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex border-b border-slate-800 pb-2">
        <h4 className="text-left text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
          Compete
        </h4>
        <div className="ml-auto flex items-center justify-center gap-3">
          <div className="flex h-full items-center justify-center gap-3 rounded-lg bg-slate-800 p-3 text-sm tracking-tighter text-white shadow-card hover:cursor-pointer">
            <span>All Games</span>
            <ArrowRightCircleIcon className="w-5" />
          </div>

          <PlatformPicker />

          {/* selected-platform */}
          {/* <div className="group flex h-full w-48 items-center justify-between gap-3 rounded-lg bg-slate-800  p-3 text-xs tracking-tighter text-white shadow-card hover:cursor-pointer">
            <div className="flex items-center justify-between gap-2">
              <ComputerDesktopIcon className="w-7 rounded-md bg-sky-400 p-1" />
              <span>Desktop PC</span>
            </div>
            <ChevronRightIcon className="w-5" />
          </div> */}
        </div>
      </div>

      <section id="compete" className="space-y-10 rounded bg-light-dark p-8">
        <div className="space-y-6">
          <h5 className="text-left text-lg font-bold leading-6 -tracking-wide text-white">
            Connected Games
          </h5>

          <div className="grid grid-cols-4 gap-4">
            <div className="flex min-h-[18rem] cursor-pointer flex-col items-center justify-center gap-4 rounded-lg bg-slate-800 p-4 transition-all hover:bg-slate-700">
              <PlusCircleIcon className="w-7" />
              <span className="text-sm">Add game</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h5 className="text-left text-lg font-bold leading-6 -tracking-wide text-white">
            Available Games
          </h5>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <ChoseGameCard
                key={index}
                bgImage="http://localhost:3000/images/card-background-lol.png"
                hoverImage={BgChar}
                LogoComponentIcon={LolLogoIcon}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
