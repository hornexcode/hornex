import Button from '@/components/ui/atoms/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/atoms/dropdown-menu';
import { Team } from '@/domain/team';
import { dataLoader } from '@/lib/request';
import { ComputerDesktopIcon } from '@heroicons/react/20/solid';
import {
  Cloud,
  CreditCard,
  EditIcon,
  Gamepad2Icon,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MenuIcon,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  TrashIcon,
  UserPlus,
  Users,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

type TeamProps = Team;

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MenuIcon className="w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Team</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>Keyboard shortcuts</span>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Users className="mr-2 h-4 w-4" />
            <span>Team</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Team</span>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Github className="mr-2 h-4 w-4" />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud className="mr-2 h-4 w-4" />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const { delete: deleteTeam } = dataLoader<undefined, undefined>('deleteTeam');

export const TeamsListItem: FC<TeamProps> = (team) => {
  return (
    <Link href={`/teams/${team.id}`}>
      <div className="bg-light-dark hover:bg-dark shadow-card space-y-4 rounded  transition-all hover:cursor-pointer">
        <div className="bg-medium-dark flex items-center justify-between border-b border-dashed border-gray-700 pb-4 sm:p-6">
          <div className="block">
            <h4 className="text-sm font-semibold text-slate-200">
              {team.name}
            </h4>
          </div>
          <div className="actions flex gap-3">
            {/* <DropdownMenuDemo /> */}
            <Button
              variant="transparent"
              size="mini"
              shape="circle"
              onClick={() => deleteTeam({ id: team.id })}
            >
              <TrashIcon className="w-4 text-red-500" />
            </Button>
            <Button variant="transparent" size="mini" shape="circle">
              <EditIcon className="w-4 text-slate-200" />
            </Button>
          </div>
        </div>
        <div className="sm:p-6">
          <div className="grid grid-cols-4">
            {/* platform */}
            <div className="block">
              <div className="flex items-center">
                <div className="flex h-8 w-8 shrink-0 rounded-full bg-gray-700 text-gray-400">
                  <ComputerDesktopIcon className="m-auto h-4 w-4" />
                </div>
                <div className="ml-4 flex flex-col justify-between">
                  <div className="text-gray-400">platform</div>
                  <div className="text-sm font-medium text-white">
                    {team.platform}
                  </div>
                </div>
              </div>
            </div>

            {/* game */}
            <div className="block">
              <div className="flex items-center">
                <div className="flex h-8 w-8 shrink-0 rounded-full bg-gray-700 text-gray-400">
                  <Gamepad2Icon className="m-auto h-4 w-4" />
                </div>
                <div className="ml-4 flex flex-col justify-between">
                  <div className="text-gray-400">game</div>
                  <div className="text-sm font-medium text-white">
                    {team.game}
                  </div>
                </div>
              </div>
            </div>

            {/* members */}
            <div className="block">
              <div className="flex items-center">
                <div className="flex h-8 w-8 shrink-0 rounded-full bg-gray-700 text-gray-400">
                  <UsersIcon className="m-auto h-4 w-4" />
                </div>
                <div className="ml-4 flex flex-col justify-between">
                  <div className="text-gray-400">members</div>
                  <div className="text-sm font-medium text-white">
                    {team.num_members}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
