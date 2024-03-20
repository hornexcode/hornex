import routes from '@/config/routes';
import { BookmarkFilledIcon } from '@radix-ui/react-icons';
import { Swords } from 'lucide-react';

export const loggedUserMenuItems = [
  {
    name: 'Compete',
    icon: <Swords className="mr-2 w-5" />,
    href: routes.compete,
  },
  {
    name: 'Registrations',
    icon: <BookmarkFilledIcon className="mr-2 w-5" />,
    href: routes.registrations,
  },
];

export const visitorMenuItems = [
  {
    name: 'Compete',
    icon: <Swords className="mr-2 w-5" />,
    href: routes.compete,
  },
];
