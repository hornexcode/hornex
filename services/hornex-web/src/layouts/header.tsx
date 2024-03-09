import HornexLogo from '@/assets/images/hornex/hornex-logo.png';
import ProfileMenuItem from '@/components/profile/profile-menu-item';
import routes from '@/config/routes';
import { LoggedUser } from '@/domain';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { ArrowUpRightIcon } from '@heroicons/react/20/solid';
import { LogInIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FC, useEffect } from 'react';

interface HeaderRightAreaProps {
  user: LoggedUser;
}

const HeaderRightArea: FC<HeaderRightAreaProps> = ({ user }) => {
  return (
    <div className="relative order-last flex shrink-0 items-center ">
      <ProfileMenuItem user={user} />
    </div>
  );
};

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-dark/60 fixed top-0 z-40 h-16 w-full px-8">
      <div className="mx-auto flex h-full w-full max-w-[2160px] justify-between">
        <div className="text-title flex w-[230px] items-center text-xl font-bold">
          <Link className="text-brand mr-4 block font-extrabold" href="/">
            <Image className="w-7" src={HornexLogo} alt="Hornex logo" />
          </Link>
          HORNEX
        </div>

        {session && (
          <HeaderRightArea
            user={{
              email: session.user?.email!,
              name: session.user?.name!,
            }}
          />
        )}

        {!session && (
          <div className="flex items-center justify-center space-x-4">
            <Link href={`${routes.signIn}`}>
              <div className="text-title flex items-center font-medium">
                Sign In <LogInIcon className="text-title ml-2 h-5 w-5" />
              </div>
            </Link>
            <Link href="/register">
              <div className="text-title flex items-center font-medium">
                Create account{' '}
                <ArrowUpRightIcon className="text-title ml-2 h-5 w-5" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
