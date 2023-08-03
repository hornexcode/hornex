import ProfileMenuItem from '@/components/profile/profile-menu-item';
import { FC, useEffect, useState } from 'react';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import MenuItems from './menu/_default';
import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { User } from '@/domain';
import WalletMenuItem from '@/components/profile/wallet-menu-item';
import { useAuthContext } from '@/lib/auth/auth.context';
import { ArrowUpRightIcon } from '@heroicons/react/20/solid';
import { dataLoaders } from '@/lib/api/api';
import { CurrentUserResponse as CurrentUser } from '@/infra/hx-core/responses/current-user';
import { NotificationMenuItem } from '@/components/notifications/notification-menu-item';

interface HeaderRightAreaProps {
  user: User;
}

const { get: currentUser } = dataLoaders<CurrentUser>('currentUser');

const HeaderRightArea: FC<HeaderRightAreaProps> = ({ user }) => {
  return (
    <div className="relative order-last flex shrink-0 items-center ">
      <WalletMenuItem user={user} />
      <NotificationMenuItem />
      <ProfileMenuItem user={user} />
    </div>
  );
};

const Header = () => {
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();

  const {
    state: { user, isAuthenticated },
  } = useAuthContext();
  // const [user, setUser] = useState<User | null>(null);

  // const { data, error, isLoading, mutate } = useSWR(
  //   '/api/v1/users/current',
  //   currentUser
  // );

  // useEffect(() => {
  //   if (data?.user) {
  //     setUser({
  //       id: data.user.id,
  //       firstName: data.user.first_name,
  //       lastName: data.user.last_name,
  //       email: data.user.email,
  //     });
  //   }
  // }, [mutate, data]);

  return (
    <header className="sticky left-0 top-0 z-40 h-16 w-full bg-light-dark px-4 shadow-card">
      <div className="mx-auto flex h-full w-full max-w-[2160px] justify-between">
        <div className="flex items-center">
          <Link className="block w-24 font-extrabold text-white" href="/">
            Hornex
          </Link>
          {isMounted && ['xs', 'sm', 'md', 'lg'].indexOf(breakpoint) == -1 && (
            <MenuItems />
          )}
        </div>

        {/* {isLoading && <>loading user metadata</>} */}

        {user && (
          <HeaderRightArea
            user={{
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            }}
          />
        )}

        {!isAuthenticated && (
          <div className="flex items-center justify-center">
            <Link href="/login">
              <div className="flex items-center text-white">
                Login <ArrowUpRightIcon className="h-5 w-5 text-white" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
