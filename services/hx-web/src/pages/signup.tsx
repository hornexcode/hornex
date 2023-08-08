import { ArrowUpRightIcon, CheckCircleIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { set } from 'es-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import z from 'zod';

import Button from '@/components/ui/button/button';
import Input from '@/components/ui/form/input';
import InputLabel from '@/components/ui/form/input-label';
import { Logo } from '@/components/ui/logo';
import { dataLoadersV2 } from '@/lib/api';
import {
  SignupInput,
  SignupOutput,
  signupSchemaInput,
  signupSchemaOutput as schema,
} from '@/services/hx-core/signup';

const { post: signup } = dataLoadersV2<SignupOutput, SignupInput>(
  'signup',
  schema
);

export default function RegisterPage() {
  const [isFecthing, setIsFetching] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchemaInput),
  });

  const onSignup = async (payload: SignupInput) => {
    try {
      const data = await signup(payload);
      set('hx-auth.token', data.access_token);
      router.push('/signup-confirm');
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  const successStep = () => {
    return (
      <div className="m-auto w-[450px] space-y-4 rounded-md  p-6 sm:p-8 md:space-y-6 ">
        <div className="text-center">
          <div>
            <CheckCircleIcon className="mx-auto h-20 w-20 text-green-500" />
          </div>
          <h1 className="text-xl font-bold text-white md:text-4xl">Success!</h1>
          <p className="mb-10 px-8 text-sm text-slate-400">
            Account created successfully. Now you can login and start competing,
            click in the login button below to go the the Login page.
          </p>
          <Link href="/login" className="">
            <div className="flex items-center justify-center text-lg text-white">
              Login <ArrowUpRightIcon className="h-5 w-5 text-white" />
            </div>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen flex-col items-center justify-between">
      <div className="mt-8 self-center">
        <Logo size="sm" />
      </div>
      <div className="m-auto w-[450px] space-y-4 rounded-md  p-6 sm:p-8 md:space-y-6 ">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white md:text-4xl">
            Create your account
          </h1>
          <p className="px-8 text-sm text-slate-400">
            Register now and start competing in tournaments in a few clicks.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSignup)}
          action=""
          className="mt-6 space-y-4 md:space-y-6"
        >
          {/* Email */}
          <div>
            <InputLabel title="Email" important />
            <Input {...register('email')} placeholder="Your real email here" />
          </div>

          {/* Birth Date */}
          <div>
            <InputLabel title="Birth Date" important />
            <Input {...register('birth_date')} type="date" placeholder="" />
          </div>

          {/* Password */}
          <div>
            <InputLabel title="Password" important />
            <Input
              {...register('password')}
              type="password"
              placeholder="Type a secure password"
            />
          </div>

          <div className="mb-6 flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="terms"
                type="checkbox"
                value=""
                {...register('terms')}
                className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
              />
            </div>
            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Li e concordo com os{' '}
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-amber-500"
              >
                termos e condições
              </a>
            </label>
          </div>

          <Button
            disabled={isFecthing}
            isLoading={isFecthing}
            type="submit"
            className="w-full"
            color="secondary"
            shape="rounded"
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
