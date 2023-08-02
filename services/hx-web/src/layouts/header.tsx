import ProfileMenuItem from '@/components/profile/profile-menu-item';
import { FC } from 'react';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import MenuItems from './menu/_default';
import Link from 'next/link';

import useSWR from 'swr';
import { dataLoaders } from '@/lib/api/api';
import { useRouter } from 'next/router';
import { User } from '@/domain';
import { MeResponse } from '@/infra/hx-core/responses/me';

const { post: me } = dataLoaders<MeResponse>('me');

const AddFundsButton: FC = () => {
  return (
    <div className="flex items-center px-4 hover:cursor-pointer">
      <PlusCircleIcon className="mr-2 h-4 w-4 text-white" />
      <span className="hidden text-xs font-bold text-white md:inline-block">
        Add Funds
      </span>
    </div>
  );
};

interface HeaderRightAreaProps {
  user: User;
}

const HeaderRightArea: FC<HeaderRightAreaProps> = ({ user }) => {
  return (
    <div className="relative order-last flex shrink-0 items-center ">
      <div className="flex ">
        <ProfileMenuItem user={user} />
      </div>
      <div className="flex border-l border-white/20">
        <div className="pl-4">
          <span className="text-xs font-bold text-white">0.00 BRL</span>
        </div>
        {/* <AddFundsButton /> */}
      </div>
    </div>
  );
};

const Header = () => {
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();

  const router = useRouter();

  const { data, error, isLoading } = useSWR('me', me);

  if (error && data === undefined) {
    router.push('/login');
  }

  return (
    <header className="sticky left-0 top-0 z-40 h-14 w-full bg-sky-500 px-4 shadow-card">
      <div className="mx-auto flex h-full w-full max-w-[2160px] justify-between">
        <div className="flex items-center">
          <Link className="block w-24 font-extrabold text-white" href="/">
            Hornex
          </Link>
          {isMounted && ['xs', 'sm', 'md', 'lg'].indexOf(breakpoint) == -1 && (
            <MenuItems />
          )}
        </div>

        {!isLoading && data && (
          <HeaderRightArea
            user={{
              id: data.user.id,
              firstName: data.user.first_name,
              lastName: data.user.last_name,
              email: data.user.email,
            }}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
