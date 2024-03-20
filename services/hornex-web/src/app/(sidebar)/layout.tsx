import Header from '@/components/v2/layouts/header';
import Sidebar from '@/components/v2/layouts/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <Sidebar />
      <Header />
      <main className="3xl:px-10 relative rounded pt-16 md:pl-[230px] xl:pb-24">
        {children}
      </main>
    </div>
  );
}
