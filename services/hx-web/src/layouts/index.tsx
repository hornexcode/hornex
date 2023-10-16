import Header from './header';
import { Sidebar } from '@/components/ui/sidebar';

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
