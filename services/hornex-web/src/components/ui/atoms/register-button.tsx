import Button from './button';
import { useModal } from '@/components/modal-views/context';
import routes from '@/config/routes';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React, { FC } from 'react';

export type RegisteredButtonProps = {
  isRegistered: boolean;
  className?: string;
};

export const RegisterButton: FC<RegisteredButtonProps> = ({
  isRegistered,
  className,
}) => {
  const { openModal } = useModal();

  const { status } = useSession();
  if (status === 'unauthenticated') {
    return (
      <Button
        shape="rounded"
        className={className}
        size="small"
        onClick={() => openModal('LOGIN_VIEW')}
      >
        Sign-up to joint
      </Button>
    );
  }

  return isRegistered ? (
    <div className="text-brand flex items-center justify-center px-4 font-bold">
      <CheckCircledIcon className="mr-2 h-4 w-4" />
      Registered
    </div>
  ) : (
    <Button
      size="small"
      className={className}
      onClick={() => openModal('REGISTRATION_VIEW')}
      shape="rounded"
      variant={isRegistered ? 'ghost' : 'solid'}
      disabled={isRegistered}
    >
      Register
    </Button>
  );
};
