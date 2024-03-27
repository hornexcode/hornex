import routes from '@/config/routes';
import { BookmarkFilledIcon, RocketIcon } from '@radix-ui/react-icons';
import { Swords, UserCircle2 } from 'lucide-react';

export const mainMenuItems = [
  {
    name: 'Compete',
    icon: <Swords className="fill-body mr-2 w-5" />,
    href: routes.compete,
  },
  {
    name: 'Registrations',
    icon: <BookmarkFilledIcon className="mr-2 w-5" />,
    href: routes.registrations,
  },
];

export const organizerMenuItems = [
  {
    name: 'Tournaments',
    icon: <RocketIcon className="mr-2 w-5" />,
    href: routes.admin.tournaments,
  },
  {
    name: 'Profile',
    icon: <UserCircle2 className="mr-2 w-5" />,
    href: routes.admin.profile,
  },
];

export const visitorMenuItems = [
  {
    name: 'Compete',
    icon: <Swords className="mr-2 w-5" />,
    href: routes.compete,
  },
];
