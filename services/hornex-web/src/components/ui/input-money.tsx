import React, { useReducer } from 'react';
import { Input, InputProps } from '../ui/input';

interface MoneyInputProps extends InputProps {
  locales?: Intl.LocalesArgument;
  options?: Intl.NumberFormatOptions;
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  (props, ref) => {
    const moneyFormatter = Intl.NumberFormat(props.locales, props.options);

    const initialValue = props.value ? moneyFormatter.format(+props.value) : '';

    const [value, setValue] = useReducer((_: any, next: string) => {
      const digits = next.replace(/\D/g, '');
      return moneyFormatter.format(Number(digits) / 100);
    }, initialValue);

    function handleChange(formattedValue: string, realChangeFn: Function) {
      const digits = formattedValue.replace(/\D/g, '');
      const realValue = Number(digits) / 100;
      realChangeFn(realValue);
    }

    return (
      <Input
        placeholder={props.placeholder}
        {...props}
        onChange={(e) => {
          setValue(e.target.value);
          handleChange(e.target.value, props.onChange as Function);
        }}
        value={value}
        ref={ref}
      />
    );
  }
);
