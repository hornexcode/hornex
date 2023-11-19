import { PixIcon } from '../../atoms/icons/pix-icon';
import { RadioGroup } from '@headlessui/react';
import { CreditCard } from 'lucide-react';

const PriceOptions = [
  {
    name: 'Pix',
    value: 'fixed',
    icon: <PixIcon className="h-5 w-5 text-white sm:h-auto sm:w-auto" />,
  },

  {
    name: 'Credit Card',
    value: 'credit-card',
    icon: <CreditCard className="h-5 w-5 text-white sm:h-auto sm:w-auto" />,
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
              className={`shadow-card hover:shadow-large dark:bg-light-dark relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-solid bg-white text-center text-sm font-medium tracking-wider transition-all ${
                checked
                  ? 'border-gray-400'
                  : 'border-light-dark dark:border-light-dark'
              }`}
            >
              <span className="relative flex h-28 flex-col items-center justify-center gap-3 px-2 text-center text-xs uppercase sm:h-36 sm:gap-4 sm:text-sm">
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
