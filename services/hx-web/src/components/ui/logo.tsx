import classnames from 'classnames';
import Image from 'next/image';

import HxLogo from '@/assets/images/hornex/hornex-logo.png';

const sizes = {
  lg: 'w-[128px]',
  sm: 'w-16',
  xs: 'w-6',
};

export const Logo = ({
  size,
  className,
}: {
  size: 'lg' | 'sm' | 'xs';
  className?: string;
}) => {
  return (
    <Image
      className={classnames(sizes[size], className)}
      src={HxLogo}
      alt="hornex logo"
    />
  );
};
