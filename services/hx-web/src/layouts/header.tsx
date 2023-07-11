"use client";
import ProfileMenuItem from "@/components/profile/profile-menu-item";
import { FC } from "react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";
import { useBreakpoint } from "@/lib/hooks/use-breakpoint";
import { useWindowScroll } from "react-use";
import MenuItems from "./menu/_default";

const AddFundsButton: FC = () => {
  return (
    <div className="flex items-center px-4 hover:cursor-pointer">
      <PlusCircleIcon className="mr-2 h-4 w-4 text-white" />
      <span className="text-xs text-white ">Add Funds</span>
    </div>
  );
};

const HeaderRightArea: FC = () => {
  return (
    <div className="relative order-last flex shrink-0 items-center ">
      <div className="flex ">
        <ProfileMenuItem />
      </div>
      <div className="flex border-l border-white/60">
        <div className="pl-8">
          <span className="text-xs text-white">0.00 BRL</span>
        </div>
        <AddFundsButton />
      </div>
    </div>
  );
};

const Header = () => {
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();
  const windowScroll = useWindowScroll();
  // const { openDrawer, isOpen } = useDrawer();

  return (
    <header className="sticky left-0 top-0 z-40 h-16 w-full bg-gradient-to-r from-sky-400 to-sky-500 px-4 shadow-xl">
      <div className="mx-auto flex h-full w-full max-w-[2160px] justify-between">
        <div className="flex items-center">
          <div className="block w-24 font-extrabold text-white">Hornex.gg</div>
          {isMounted && ["xs", "sm", "md", "lg"].indexOf(breakpoint) == -1 && (
            <MenuItems />
          )}
        </div>

        <HeaderRightArea />
      </div>
    </header>
  );
};

export default Header;
