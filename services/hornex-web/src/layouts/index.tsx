import Button from '@/components/ui/atoms/button';
import Header from './header';
import { Sidebar } from '@/components/ui/atoms/sidebar';
import { toast } from 'sonner';
import Link from 'next/link';
import { LeagueOfLegendsLogo } from '@/components/ui/atoms/icons/league-of-legends-icon';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="3xl:px-10 relative min-h-[100vh] rounded-t pb-16 sm:pb-20 md:pl-16 xl:pb-24">
        {/* connect account */}
        <div className="bg-light-dark shadow-card p-6">
          <h2 className="text-title text-lg font-bold">Connect your account</h2>
          <p className="text-title text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio,
            nostrum!
          </p>
          <div className="pt-6">
            <Link
              className="text-light-dark border-title bg-title shadow-3xl hover:text-title hover:border-title rounded border-2 px-8 py-1.5 text-sm transition duration-100 ease-in-out hover:bg-transparent"
              href="https://auth.riotgames.com/authorize?client_id=6bb8a9d1-2dbe-4d1f-b9cb-e4fbade3db54&redirect_uri=https://robin-lasting-magpie.ngrok-free.app/api/v1/riot/webhooks/oauth2/callback&response_type=code&scope=openid+offline_access"
              target="_blank"
            >
              <span>Connect</span>
            </Link>
          </div>
        </div>
        {children}
      </main>
    </>
  );
};
