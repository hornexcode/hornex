import Header from './header';
import { Sidebar } from '@/components/ui/atoms/sidebar';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <Sidebar />
      <main className="3xl:px-10 relative rounded md:pl-[180px] xl:pb-24">
        <Header />
        {children}
      </main>
    </div>
  );
};
