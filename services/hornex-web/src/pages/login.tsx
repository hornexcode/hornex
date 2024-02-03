import Button from '@/components/ui/atoms/button/button';
import Input from '@/components/ui/atoms/form/input';
import InputLabel from '@/components/ui/atoms/form/input-label';
import { Logo } from '@/components/ui/atoms/logo';
import routes from '@/config/routes';
import { useAuthContext } from '@/lib/auth/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const form = z.object({
  email: z.string().email({ message: 'Valid email required' }),
  password: z.string(),
  // .min(8, { message: 'Password must contain at least 8 characters' }),
});

type LoginForm = z.infer<typeof form>;

export default function LoginPage() {
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(form),
  });

  const { login, error, state } = useAuthContext();
  const handleOnSubmit = async (data: LoginForm) => {
    setFetching(true);
    const ok = await login({
      email: data.email,
      password: data.password,
    });

    if (ok) {
      setSuccess(true);
      router.push('/compete');
    }
    setFetching(false);
  };

  // TODO: remove in production
  useEffect(() => {}, [setValue]);

  return (
    <div className="flex h-screen flex-col items-center justify-between">
        <div className="mt-8 self-center">
        <Logo size="sm" />
      </div>
      <div className="m-auto w-full sm:w-[400px]">
        <div className="rounded p-6 sm:p-8">
          <div className="pb-8 pt-2">
            <h1 className="text-xl font-bold text-white md:text-4xl">
              Welcome
            </h1>
          </div>
          <div className="space-y-4">
            {error && (
              <div className="rounded bg-red-500 p-2 text-center text-sm text-white">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded bg-green-500 p-2 text-center text-sm text-white">
                Login successful!
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
                <div className="mt-1 flex items-center justify-between">
                  <a
                    href="#"
                    className="text-sm font-normal text-gray-400 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  isLoading={fetching}
                  disabled={fetching}
                  fullWidth
                  size="small"
                  shape="rounded"
                >
                  Login
                </Button>

                <p className="mt-1 text-sm font-normal text-gray-400">
                  Não possui uma conta?{' '}
                  <Link
                    href={`${routes.register}`}
                    className="font-bold text-gray-200 hover:underline"
                  >
                    Registre-se
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};
