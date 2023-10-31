import { atom, useAtom } from 'jotai';

export type MODAL_VIEW = 'SEARCH_VIEW' | 'USER_SEARCH_VIEW';

export type Callback = () => void;
interface ModalTypes {
  isOpen: boolean;
  view: MODAL_VIEW;
  data: any;
  callback: Callback;
}

const modalAtom = atom<ModalTypes>({
  isOpen: false,
  view: 'SEARCH_VIEW',
  data: null,
  callback: () => {},
});

export function useModal<F extends Callback>(callback?: F) {
  const [state, setState] = useAtom(modalAtom);
  const openModal = (view: MODAL_VIEW, data?: any) =>
    setState({ ...state, isOpen: true, view, data });
  const closeModal = () => setState({ ...state, isOpen: false });

  return {
    ...state,
    openModal,
    closeModal,
    callback,
  };
}
