'use client';
import Button from '@/components/ui/atoms/button';
import InputLabel from '@/components/ui/atoms/form/input-label';
import { Logo } from '@/components/ui/atoms/logo';
import { Input } from '@/components/ui/input';
import routes from '@/config/routes';
import { Token } from '@/lib/auth/auth-context.types';
import { dataLoader } from '@/lib/request';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { setCookie } from 'nookies';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const form = z.object({
  email: z.string().email({ message: 'Valid email required' }),
  password: z.string(),
  // .min(8, { message: 'Password must contain at least 8 characters' }),
});

export type LoginForm = z.infer<typeof form>;

const { submit: login } = dataLoader<Token, LoginForm>('login');

const LoginForm = () => {
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const { register, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(form),
  });

  const handleOnSubmit = async (data: LoginForm) => {
    setSuccess(false);
    setError('');
    setFetching(true);

    const { data: session, error } = await login({}, data);
    if (error) {
      setError(error?.message);
      setFetching(false);
      return;
    }
    if (!session) {
      setError('Something went wrong');
      setFetching(false);
      return;
    }

    setCookie(null, 'hx', session.access, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setFetching(false);
      return;
    }

    setFetching(false);
    setSuccess(true);
    router.push('/compete');
  };

  return (
    <div className="border-border rounded border p-6 sm:p-8">
      <div className="self-center">
        <Logo size="sm" className="mx-auto" />
      </div>
      <h1 className="text-title mb-4 text-2xl font-extrabold">Login</h1>
      <div className="space-y-2">
        {error && (
          <div className="rounded bg-red-500 p-2 text-center  text-white">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded bg-green-500 p-2 text-center  text-white">
            Login successful!
          </div>
        )}
        <form
          method="post"
          className="space-y-4"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          {/* Email */}
          <div>
            <InputLabel title="Email" important />
            <Input {...register('email', { required: true })} />
          </div>

          {/* Password */}
          <div>
            <Input
              type="password"
              {...register('password', { required: true })}
            />
            <div className="mt-1 flex items-center justify-between">
              <a href="#" className=" text-body font-normal hover:underline">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button
              isLoading={fetching}
              disabled={fetching}
              fullWidth
              shape="rounded"
              size="small"
              type="submit"
            >
              Login
            </Button>

            <p className="mt-1  font-normal text-gray-400">
              Do not have an account yet?{' '}
              <Link
                href={`${routes.register}`}
                className="font-bold text-gray-200 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
