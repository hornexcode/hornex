'use client';
import Link from 'next/link';

import {
  ArrowRightCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/20/solid';
import { ChoseGameCard, PlatformPicker } from '@/components/compete';
import BgChar from '@/assets/images/lol-bg-char.png';
import { LolLogoIcon } from '@/components/ui/icons';

export default function Compete() {
  return (
    <div className="mx-auto space-y-8 p-8">
      <div className="flex items-end justify-between border-b border-slate-800 pb-2">
        <h2 className="text-left text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
          Connected Games
        </h2>

        <PlatformPicker />
      </div>

      <section id="compete" className="space-y-10">
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex min-h-[18rem] cursor-pointer flex-col items-center justify-center gap-4 rounded-lg bg-slate-800 p-4 transition-all hover:bg-slate-700">
              <PlusCircleIcon className="w-7" />
              <span className="text-sm">Add game</span>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="mb-4 border-b border-slate-800 pb-2">
            <h2 className="text-left text-xl font-bold leading-4 -tracking-wider text-white lg:text-xl">
              Available Games
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <ChoseGameCard
                key={index}
                bgImage={'http://localhost:3000/images/card-background-lol.png'}
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
