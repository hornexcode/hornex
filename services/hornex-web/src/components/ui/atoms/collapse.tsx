/* eslint-disable react-hooks/exhaustive-deps */
import { Plus } from '@/components/ui/atoms/icons/plus';
import { useMeasure } from '@/hooks/use-measure';
import { useEffect, useState } from 'react';

interface CollapseProps {
  label: string;
  initialOpen?: boolean;
}

export default function Collapse({
  label,
  children,
  initialOpen = false,
}: React.PropsWithChildren<CollapseProps>) {
  let [isOpen, setIsOpen] = useState(false);
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  useEffect(() => {
    initialOpen && setIsOpen(true);
  }, [initialOpen]);

  return (
    <div
      className={`ease-[cubic-bezier(0.33, 1, 0.68, 1)] shadow-card hover:shadow-transaction dark:bg-medium-dark relative mb-5 overflow-hidden rounded bg-white transition-all duration-[350ms] last:mb-0 ${
        isOpen ? 'shadow-transaction' : 'shadow-card'
      }`}
      style={{ height: isOpen ? 54 + height : 54 }}
    >
      <button
        className="h-13 flex w-full items-center justify-between px-5 py-2 text-sm font-medium uppercase tracking-wider text-gray-900 dark:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}

        <span
          className={`shrink-0 transition-transform duration-200 ltr:ml-4 rtl:mr-4 ${
            isOpen ? 'rotate-45' : ''
          }`}
        >
          <Plus className="" />
        </span>
      </button>

      <div
        className={`border-t border-dashed ${
          isOpen ? 'border-gray-200 dark:border-gray-700' : 'border-transparent'
        }`}
        ref={ref}
      >
        {children}
      </div>
    </div>
  );
}
