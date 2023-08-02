import Button from '@/components/ui/button/button';
import Input from '@/components/ui/form/input';
import InputLabel from '@/components/ui/form/input-label';
import { LoginResponse } from '@/infra/hx-core/responses/login';
import { dataLoaders } from '@/lib/api/api';

import { useState } from 'react';

const { post: login } = dataLoaders<LoginResponse>('login');

export default function LoginPage() {
  const [email, setEmail] = useState('pehome7132@kkoup.com');
  const [password, setPassword] = useState('Password@123!');

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const response = await login({
      email: 'pehome7132@kkoup.com',
      password: 'Password@123!',
    });

    console.log(response);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-between">
      <div className="shadow-highlight-100 m-auto w-[450px] space-y-4 rounded-md border border-gray-800 bg-gray-800 p-6 sm:p-8 md:space-y-6">
        <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-white md:text-3xl">
          Login
        </h1>
        <div className="mt-6 space-y-4 md:space-y-6">
          {/* Email */}

          <div>
            <InputLabel title="Seu email" important />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              placeholder="jonh.doe@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <InputLabel title="Sua senha" important />
            <Input
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="****"
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
            onClick={(e) => onSubmit(e)}
            className="w-full"
            color="info"
            shape="rounded"
          >
            Login
          </Button>

          <p className="text-sm font-light text-gray-400">
            Não possui uma conta?{' '}
            <a href="#" className="font-medium text-blue-300 hover:underline">
              Registre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
