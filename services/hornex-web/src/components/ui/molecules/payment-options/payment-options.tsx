import { PixIcon } from '@/components/ui/atoms/icons/pix-icon';
import { PaymentMethod } from '@/components/ui/templates/tournament-checkout-template/tournament-checkout-template.types';
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
  onChange: (value: PaymentMethod) => void;
};

export default function PaymentOptions({
  value,
  onChange,
}: PaymentOptionsProps) {
  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      className="grid grid-cols-2 gap-4"
    >
      {PriceOptions.map((item, index) => (
        <RadioGroup.Option value={item.value} key={index}>
          {({ checked }) => (
            <span
              className={`dark:bg-dark relative flex cursor-pointer items-center justify-center rounded border border-gray-500  bg-white text-center text-sm font-medium transition-all ${
                checked ? 'ring ring-gray-100' : ''
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
