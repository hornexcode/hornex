import { useModal } from '../modal-views/context';
import Button from '../ui/atoms/button/button';
import Loader from '../ui/atoms/loader';
import UserSearchList from '../users/user-search-list';
import AnchorLink from '@/components/ui/atoms/links/anchor-link';
import { dataLoader } from '@/lib/api';
import { routes } from '@/lib/api/routes';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSWRConfig } from 'swr';

type TagProps = {
  label: string;
  link: string;
};

export function Tag({ label, link }: TagProps) {
  return (
    <AnchorLink
      href={link}
      className="shadow-light xs:mr-3 xs:mt-3 xs:px-3 xs:py-2 xs:text-sm mr-2.5 mt-2.5 inline-flex transform rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium tracking-tighter text-gray-900 outline-none transition-transform duration-200 last:mr-0 hover:-translate-y-0.5 hover:bg-gray-50 focus:-translate-y-0.5 focus:bg-gray-50 dark:bg-gray-800 dark:text-white"
    >
      {label}
    </AnchorLink>
  );
}

const { post: sendInvite } = dataLoader<{}>('inviteUser');

export default function SearchView({ ...props }) {
  const { mutate } = useSWRConfig();
  const { query } = useRouter();
  const { closeModal } = useModal();
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function sendMemberInvite() {
    const { data, error, headers, status } = await sendInvite({
      team: query.id,
      user: userId,
    });

    if (error?.response) {
      toast.error(error.response.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    toast.success('User successfully invited');
    mutate(routes.getTeamInvites.path);
    closeModal();
  }

  return (
    <div
      className="xs:w-[480px] relative z-50 mx-auto w-full max-w-full sm:w-[600px] lg:w-[900px]"
      {...props}
    >
      <div className="bg-light-dark rounded-lg p-5">
        <UserSearchList onSelect={(id: string) => setUserId(id)} />
        <Button
          onClick={sendMemberInvite}
          fullWidth
          size="small"
          color="gray"
          shape="rounded"
        >
          {isLoading ? <Loader /> : 'Invite'}
        </Button>
      </div>
    </div>
  );
}
