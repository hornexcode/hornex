import Header from '@/layouts/header';
import { Sidebar } from '@/components/ui/sidebar';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="">
      <Header />
      <Sidebar className="hidden md:flex" />
      <main className="3xl:px-10 relative min-h-[100vh] pb-16 sm:pb-20 md:pl-16 xl:pb-24">
        {children}
      </main>
    </div>
  );
}
