"use client";
import { SwordsIcon } from "@/components/ui/icons";
import Header from "@/layouts/header";
import { HomeIcon, TrophyIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Header />
      <div className="fixed top-14 z-40 h-full w-16 border-r border-t border-slate-800 bg-light-dark shadow-2xl">
        <ul className="block space-y-3 py-2">
          <li className="px-2">
            <Link
              href={"/"}
              className="group flex h-[44px] cursor-pointer items-center justify-center rounded-lg bg-sky-500 text-center shadow-lg transition-all hover:bg-slate-700"
            >
              <HomeIcon className="h-5 w-5 text-white shadow-xl group-hover:text-white" />
            </Link>
          </li>
          <li className="px-2">
            <Link
              href="#"
              className="group flex h-[44px] cursor-pointer items-center justify-center rounded-lg bg-slate-800 text-center shadow-lg transition-all hover:bg-slate-700"
            >
              <TrophyIcon className="h-4 w-4 text-slate-400 shadow-xl group-hover:text-white" />
            </Link>
          </li>
          <li className="px-2">
            <Link
              href="#"
              className="group flex h-[44px] cursor-pointer items-center justify-center rounded-lg bg-slate-800 text-center shadow-lg transition-all hover:bg-slate-700"
            >
              <SwordsIcon className="h-4 w-4 fill-slate-400 shadow-xl group-hover:text-white" />
            </Link>
          </li>
        </ul>
      </div>
      <main className="3xl:px-10 relative min-h-[100vh] pb-16 pl-16 sm:pb-20 xl:pb-24">
        {children}
      </main>
    </div>
  );
}
