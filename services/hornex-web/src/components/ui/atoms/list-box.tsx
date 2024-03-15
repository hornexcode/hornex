import { ChevronDown } from './icons';
import { Transition } from '@/components/ui/atoms/transition';
import { Listbox as HeadlessListbox } from '@headlessui/react';
import cn from 'classnames';
import { Fragment } from 'react';

export type ListboxOption = {
  name: string;
  value: string;
};

interface ListboxTypes {
  options: ListboxOption[];
  selectedOption: ListboxOption;
  // onChange: any;
  onChange: React.Dispatch<React.SetStateAction<ListboxOption>>;
  children?: React.ReactNode;
  onSelect?: (value: string) => void;
  variant?: 'ghost' | 'solid' | 'transparent';
  className?: string;
  listBoxClassName?: string;
  // value: string | number;
}

const listboxVariantClasses = {
  ghost:
    'transition-shadow border border-border bg-dark text-gray-900 hover:border-gray-900 hover:ring-1 hover:ring-gray-900 dark:border-border dark:bg-medium-dark dark:text-gray-100 dark:hover:border-gray-600 dark:hover:ring-gray-600',
  solid:
    'transition-colors bg-gray-100 hover:bg-gray-200/70 dark:bg-gray-800 dark:hover:bg-gray-700',
  transparent: '',
};

export default function Listbox({
  options,
  onChange,
  onSelect,
  variant = 'ghost',
  selectedOption,
  className,
  listBoxClassName,
  children,
}: ListboxTypes) {
  return (
    <div className={cn('relative', className)}>
      <HeadlessListbox value={selectedOption} onChange={onChange}>
        <HeadlessListbox.Button
          className={cn(
            'text-case-inherit letter-space-inherit flex h-8 w-full items-center justify-between rounded px-4 font-medium outline-none duration-200 sm:h-10 sm:px-5',
            listboxVariantClasses[variant],
            listBoxClassName
          )}
        >
          <div className="mr-2 flex items-center">{selectedOption?.name}</div>
          <ChevronDown />
        </HeadlessListbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <HeadlessListbox.Options className="xs:p-2 shadow-large bg-background dark:border-border absolute left-0 z-10 mt-1 grid w-full origin-top-right gap-0.5 rounded border border-gray-200 p-1 outline-none">
            {options.map((option) => (
              <HeadlessListbox.Option key={option.value} value={option}>
                {({ selected }) => (
                  <div
                    onClick={() => onSelect && onSelect(option.value)}
                    className={`flex cursor-pointer items-center rounded-md px-3 py-2 font-normal text-gray-900 transition dark:text-gray-100  ${
                      selected
                        ? 'dark:bg-dark/80 bg-gray-200/70 font-medium'
                        : 'dark:hover:bg-dark/80 hover:bg-gray-100'
                    }`}
                  >
                    {option.name}
                  </div>
                )}
              </HeadlessListbox.Option>
            ))}
            {/* any custom / external link or element */}
            {children && children}
          </HeadlessListbox.Options>
        </Transition>
      </HeadlessListbox>
    </div>
  );
}
