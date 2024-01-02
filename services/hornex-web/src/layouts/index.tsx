import Header from './header';
import Button from '@/components/ui/atoms/button';
import { Sidebar } from '@/components/ui/atoms/sidebar';
import { toast } from 'sonner';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="3xl:px-10 relative min-h-[100vh] rounded-t pb-16 sm:pb-20 md:pl-16 xl:pb-24">
        {children}
      </main>
    </>
  );
};
