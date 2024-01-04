import { PixIcon } from '../../atoms/icons/pix-icon';
import { RadioGroup } from '@headlessui/react';
import { CreditCard } from 'lucide-react';

const PriceOptions = [
  {
    name: 'Pix',
    value: 'pix',
    icon: <PixIcon className="h-4 w-4 text-white sm:h-auto sm:w-auto" />,
  },

  {
    name: 'Credit Card',
    value: 'credit-card',
    icon: <CreditCard className="h-4 w-4 text-white sm:h-auto sm:w-auto" />,
  },
];

type PaymentOptionsProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function PaymentOptions({
  value,
  onChange,
}: PaymentOptionsProps) {
  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      className="grid grid-cols-2 gap-3"
    >
      {PriceOptions.map((item, index) => (
        <RadioGroup.Option value={item.value} key={index}>
          {({ checked }) => (
            <span
              className={`shadow-card hover:shadow-large dark:bg-dark relative flex cursor-pointer items-center justify-center rounded  border-2 border-transparent bg-white text-center text-sm font-medium transition-all ${
                checked ? 'border-cyan-400 ring-2' : ''
              }`}
            >
              <span className="sm:h-30 relative flex h-28 flex-col items-center justify-center gap-3 px-2 text-center text-xs uppercase sm:gap-4 sm:text-sm">
                {item.icon}
                {item.name}
              </span>
            </span>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
}
