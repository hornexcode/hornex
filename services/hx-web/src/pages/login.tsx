import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/ui/button/button';
import Input from '@/components/ui/form/input';
import InputLabel from '@/components/ui/form/input-label';
import routes from '@/config/routes';
import { useAuthContext } from '@/lib/auth/auth.context';

const form = z.object({
  email: z.string().email({ message: 'Valid email required' }),
  password: z
    .string()
    .min(8, { message: 'Password must contain at least 8 characters' }),
});

type LoginForm = z.infer<typeof form>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(form),
  });

  const { login, fetching, error, state } = useAuthContext();
  const handleOnSubmit = async (data: LoginForm) => {
    await login({
      email: data.email,
      password: data.password,
    });

    router.push(routes.compete);
  };

  useEffect(() => {
    if (state.isAuthenticated) {
      router.push(routes.compete);
    }
  }, []);

  // TODO: remove in production
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setValue('email', 'pehome7132@kkoup.com');
      setValue('password', 'Password@123!');
    }
  }, [setValue]);

  return (
    <div className="flex h-screen flex-col items-center justify-between">
      <div className="shadow-highlight-100 m-auto w-[450px] space-y-4 rounded border border-gray-800 bg-gray-800 p-6 sm:p-8 md:space-y-6">
        {/* <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-white md:text-3xl">
          Login
        </h1> */}
        {error && (
          <div className="rounded bg-red-500 p-2 text-center text-sm text-white">
            {error}
          </div>
        )}
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          {/* Email */}
          <div>
            <InputLabel title="Email" important />
            <Input
              placeholder="jonh.doe@example.com"
              error={errors.email?.message}
              {...register('email', { required: true })}
            />
          </div>

          {/* Password */}
          <div>
            <InputLabel title="Password" important />
            <Input
              type="password"
              placeholder="****"
              error={errors.password?.message}
              {...register('password', { required: true })}
            />
          </div>

          <div className="flex items-center justify-between">
            <a
              href="#"
              className="text-sm font-medium text-gray-400 hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </div>

          <Button
            isLoading={fetching}
            className="w-full"
            color="warning"
            shape="rounded"
          >
            Login
          </Button>

          <p className="text-sm font-light text-gray-400">
            Não possui uma conta?{' '}
            <Link
              href={`${routes.register}`}
              className="font-medium text-blue-300 hover:underline"
            >
              Registre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
