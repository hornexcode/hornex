import { Button } from '../button';
import React from 'react';

export const ExpiredLoginButton = () => {
  return (
    <div className="text-title p-4">
      <h2 className="text-3xl">Your login has expired</h2>
      <p className="font-source-sans text-lg">click to sign in again</p>
      <Button>Sign In</Button>
    </div>
  );
};
