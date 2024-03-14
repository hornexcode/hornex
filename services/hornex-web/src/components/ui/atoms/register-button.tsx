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

  const { data: session } = useSession();
  if (!session) {
    return (
      <Link className="" href={routes.signup}>
        Sign-up to joint
      </Link>
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
