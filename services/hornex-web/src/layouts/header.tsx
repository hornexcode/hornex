import MenuItems from './menu/_default';
import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import { NotificationMenuItem } from '@/components/notifications/notification-menu-item';
import ProfileMenuItem from '@/components/profile/profile-menu-item';
import { LoggedUser } from '@/domain';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { ArrowUpRightIcon } from '@heroicons/react/20/solid';
import { LogInIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FC } from 'react';

interface HeaderRightAreaProps {
  user: LoggedUser;
}

const HeaderRightArea: FC<HeaderRightAreaProps> = ({ user }) => {
  return (
    <div className="relative order-last flex shrink-0 items-center ">
      {/* <WalletMenuItem user={user} /> */}
      <NotificationMenuItem />
      <ProfileMenuItem user={user} />
    </div>
  );
};

const Header = () => {
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();

  const { data: session } = useSession();
  const { user } = session || {};

  return (
    <header className="bg-medium-dark shadow-card fixed top-0 z-40 h-16 w-full px-8">
      <div className="mx-auto flex h-full w-full max-w-[2160px] justify-between">
        <div className="text-title flex w-[250px] items-center text-xl font-bold">
          <Link className="text-brand mr-4 block font-extrabold" href="/">
            <Image className="w-7" src={HornexLogo} alt="Hornex logo" />
          </Link>
          HORNEX
        </div>
        {/* <div className="flex items-center">
          {isMounted && ['xs', 'sm', 'md', 'lg'].indexOf(breakpoint) == -1 && (
            <MenuItems />
          )}
        </div> */}

        {/* {isLoading && <>loading user metadata</>} */}

        {user && (
          <HeaderRightArea
            user={{
              email: user.email!,
              name: user.name!,
            }}
          />
        )}

        {!session && (
          <div className="flex items-center justify-center space-x-4">
            <Link href="/login">
              <div className="flex items-center text-sm text-white">
                Login <LogInIcon className="ml-2 h-5 w-5 text-white" />
              </div>
            </Link>
            <Link href="/register">
              <div className="flex items-center text-sm text-white">
                Register{' '}
                <ArrowUpRightIcon className="ml-2 h-5 w-5 text-white" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
