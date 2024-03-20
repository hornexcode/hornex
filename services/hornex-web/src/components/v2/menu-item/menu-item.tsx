'use client';

import { MenuItemProps } from './menu-item.types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

const MenuItem: FC<MenuItemProps> = ({ icon, href, name }) => {
  const pathname = usePathname();

  const isActivePage = pathname === href;

  return (
    <li
      className={cn(
        'relative rounded p-2 px-3',
        isActivePage && 'bg-brand/10 '
      )}
    >
      {isActivePage && (
        <div className="bg-brand absolute right-0 top-[calc(50%-10px)] h-[20px] w-1"></div>
      )}
      <Link href={href} className="group cursor-pointer transition-all">
        <div className="flex items-center rounded-lg">
          <div className={cn('text-body', isActivePage && 'text-brand')}>
            {icon}
          </div>
          <span className={cn('text-body', isActivePage && 'text-brand')}>
            {name}
          </span>
        </div>
      </Link>
    </li>
  );
};
export default MenuItem;
