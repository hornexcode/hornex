import Button from '@/components/ui/atoms/button/button';
import Input from '@/components/ui/atoms/form/input';
import InputLabel from '@/components/ui/atoms/form/input-label';
import { Logo } from '@/components/ui/atoms/logo';
import routes from '@/config/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
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
  const [error, setError] = useState('');

  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(form),
  });

  const handleOnSubmit = async (data: LoginForm) => {
    setSuccess(false);
    setError('');
    setFetching(true);

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

  // TODO: remove in production
  useEffect(() => {}, [setValue]);

  return (
    <div className="bg-dark flex h-screen flex-col items-center justify-between">
      <div className="m-auto w-full sm:w-[400px]">
        <div className="mt-8 self-center">
          <Logo size="sm" className="mx-auto" />
        </div>
        <div className="rounded p-6 sm:p-8">
          <div className="space-y-4">
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
                <Input
                  type="password"
                  placeholder="password"
                  error={errors.password?.message}
                  {...register('password', { required: true })}
                />
                <div className="mt-1 flex items-center justify-between">
                  <a
                    href="#"
                    className=" font-normal text-gray-400 hover:underline"
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
                  shape="rounded"
                >
                  Sign In
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
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};
