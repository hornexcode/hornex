import Button from './button';
import { useModal } from '@/components/modal-views/context';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
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
  return isRegistered ? (
    <div className="text-brand ml-4 flex items-center px-4">
      <CheckCircledIcon className="mr-2 h-4 w-4" />
      Registered
    </div>
  ) : (
    <Button
      size="small"
      className={clsx('block', className)}
      onClick={() => openModal('REGISTRATION_VIEW')}
      shape="rounded"
      variant={isRegistered ? 'ghost' : 'solid'}
      disabled={isRegistered}
    >
      Register
    </Button>
  );
};
