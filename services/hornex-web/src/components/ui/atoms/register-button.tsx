import Button from './button';
import { useModal } from '@/components/modal-views/context';
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
  return (
    <Button
      size="small"
      className={clsx('block', className)}
      onClick={() => openModal('REGISTRATION_VIEW')}
      shape="rounded"
      variant={isRegistered ? 'ghost' : 'solid'}
      disabled={isRegistered}
    >
      {isRegistered ? 'Registered' : 'Register'}
    </Button>
  );
};
