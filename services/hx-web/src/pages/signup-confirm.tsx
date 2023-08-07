import { ArrowUpRightIcon, CheckCircleIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/ui/button/button';
import Input from '@/components/ui/form/input';
import InputLabel from '@/components/ui/form/input-label';
import { Logo } from '@/components/ui/logo';
import { dataLoaders } from '@/lib/api';

const { post: signup } = dataLoaders('signup');

export default function RegisterPage() {
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');

  function onSendCodeHandler(e: any) {
    e.preventDefault();
    setCodeSent(true);
  }

  return (
    <div className="flex h-screen flex-col items-center justify-between">
      <div className="mt-8 self-center">
        <Logo size="sm" />
      </div>
      <div className="m-auto w-[450px] space-y-4 rounded-md  p-6 sm:p-8 md:space-y-6 ">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white md:text-4xl">
            Confirm your account
          </h1>
          <p className="px-8 text-sm text-slate-400">
            We are going to send a 6-digits code to your email address to
            confirm your account. Verify you spam folder if you do not receive
          </p>
        </div>
        <form action="" className="mt-6 space-y-4 md:space-y-6">
          {/* Email */}
          <div>
            <InputLabel title="Code" important />
            <div className="relative">
              <div className="absolute right-6 flex h-full items-center">
                {!codeSent && (
                  <button
                    onClick={(e) => onSendCodeHandler(e)}
                    className="!cursor-pointer !text-sm !text-amber-400 hover:!underline"
                    style={{ all: 'unset' }}
                  >
                    get code
                  </button>
                )}
                {codeSent && (
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="ml-2 text-sm text-slate-400">
                      Code sent
                    </span>
                  </div>
                )}
              </div>
              <Input
                placeholder="000000"
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>

          <Button
            disabled={!codeSent || code.length < 6}
            className="w-full"
            color="secondary"
            shape="rounded"
          >
            Confirm Email
          </Button>
        </form>
      </div>
    </div>
  );
}
