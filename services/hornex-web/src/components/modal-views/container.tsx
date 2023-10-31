import {
  Callback,
  MODAL_VIEW,
  useModal,
} from '@/components/modal-views/context';
import Button from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Close } from '@/components/ui/icons/close';
import { Transition } from '@/components/ui/transition';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
// dynamic imports
const SearchView = dynamic(() => import('@/components/search/view'));
const UserSearchView = dynamic(
  () => import('@/components/users/user-search-list')
);

function renderModalContent(view: MODAL_VIEW, callback: Callback | undefined) {
  switch (view) {
    case 'SEARCH_VIEW':
      return <SearchView />;
    case 'USER_SEARCH_VIEW':
      return <UserSearchView onSelect={callback} />;

    default:
      return null;
  }
}

export default function ModalContainer() {
  const router = useRouter();
  const { view, isOpen, closeModal, callback } = useModal();

  useEffect(() => {
    // close search modal when route change
    router.events.on('routeChangeStart', closeModal);
    return () => {
      router.events.off('routeChangeStart', closeModal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="3xl:p-12 fixed inset-0 z-50 h-full w-full overflow-y-auto overflow-x-hidden p-4 text-center sm:p-6 lg:p-8 xl:p-10"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 z-40 cursor-pointer bg-gray-700 bg-opacity-60 backdrop-blur" />
        </Transition.Child>

        {/* This element is to trick the browser into centering the modal contents. */}
        {view && view !== 'SEARCH_VIEW' && (
          <span className="inline-block h-full align-middle" aria-hidden="true">
            &#8203;
          </span>
        )}

        {/* This element is need to fix FocusTap headless-ui warning issue */}
        <div className="sr-only">
          <Button
            size="small"
            color="gray"
            shape="circle"
            onClick={closeModal}
            className="opacity-50 hover:opacity-80 "
          >
            <Close className="h-auto w-[13px]" />
          </Button>
        </div>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-105"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-105"
        >
          <div
            className={cn(
              'xs:w-auto relative z-50 inline-block w-full text-left align-middle'
            )}
          >
            {view && renderModalContent(view, callback)}
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
