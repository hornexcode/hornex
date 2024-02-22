import { Input, InputProps } from '../ui/input';
import React, { ChangeEventHandler, useReducer } from 'react';

interface MoneyInputProps extends InputProps {
  locales?: Intl.LocalesArgument;
  options?: Intl.NumberFormatOptions;
}

const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  (props, ref) => {
    const moneyFormatter = Intl.NumberFormat(props.locales, props.options);

    const initialValue = props.value ? moneyFormatter.format(+props.value) : '';

    const [value, setValue] = useReducer((_: any, next: string) => {
      const digits = next.replace(/\D/g, '');
      return moneyFormatter.format(Number(digits) / 100);
    }, initialValue);

    return (
      <Input
        placeholder={props.placeholder}
        {...props}
        onChange={(e) => {
          setValue(e.target.value);

          const digits = e.target.value.replace(/\D/g, '');
          const realValue: unknown = Number(digits) / 100;
          props.onChange?.({
            ...e,
            target: { ...e.target, value: realValue as string },
          });
        }}
        value={value}
        ref={ref}
      />
    );
  }
);

MoneyInput.displayName = 'MoneyInput';

export { MoneyInput };
