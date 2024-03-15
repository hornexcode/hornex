import { authOptions } from '../api/auth/[...nextauth]/options';
import LoginForm from '@/components/ui/templates/login-form';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/compete');
  }

  return (
    <div className="flex h-screen flex-col items-center justify-between">
      <div className="m-auto w-full sm:w-[380px]">
        <LoginForm />
      </div>
    </div>
  );
}
