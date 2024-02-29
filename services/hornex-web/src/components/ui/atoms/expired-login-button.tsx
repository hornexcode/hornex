import { Button } from '../button';
import routes from '@/config/routes';
import Link from 'next/link';
import React from 'react';

export const ExpiredLoginButton = () => {
  return (
    <div className="text-title p-4">
      <h2 className="font-roboto-condensed text-3xl">Your login has expired</h2>
      <p className="font-source-sans text-xl font-normal">
        click to sign in again
      </p>
      <div className="mt-4">
        {' '}
        <Link
          href={routes.signIn}
          className="bg-brand text-dark mt-2 rounded p-2 px-4 "
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};
