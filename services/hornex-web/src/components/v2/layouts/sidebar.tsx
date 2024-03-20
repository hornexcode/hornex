import {
  mainMenuItems,
  organizerMenuItems,
  visitorMenuItems,
} from './_menu-items';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import MenuItem from '@/components/v2/menu-item';
import classNames from 'classnames';
import { getServerSession } from 'next-auth';
import React from 'react';

export default async function Sidebar({ className }: { className?: string }) {
  const session = await getServerSession(authOptions);

  return (
    <div
      className={classNames(
        'border-border/50 fixed top-[calc(4rem+2px)] z-30 flex h-full w-[230px] flex-col border-r border-dashed p-2',
        className
      )}
    >
      <div className="p-4">
        <h4 className="text-body px-2 text-sm font-bold uppercase">Main</h4>
        <ul className="mt-2 flex w-full flex-col font-medium">
          {session &&
            mainMenuItems.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
          {!session &&
            visitorMenuItems.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
        </ul>
      </div>
      {session && (
        <div className="p-4">
          <h4 className="text-body px-2 text-sm font-bold uppercase">
            Organizer
          </h4>
          <ul className="mt-2 flex w-full flex-col font-medium">
            {organizerMenuItems.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
