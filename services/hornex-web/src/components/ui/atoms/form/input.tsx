import cn from 'classnames';
import { forwardRef } from 'react';

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
  useUppercaseLabel?: boolean;
  icon?: React.ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      type = 'text',
      className,
      inputClassName,
      useUppercaseLabel = true,
      ...props
    },
    ref
  ) => (
    <div className={cn(className)}>
      <label>
        {label && (
          <span
            className={cn(
              'block font-medium tracking-widest text-gray-100',
              useUppercaseLabel ? 'mb-2 uppercase sm:mb-3' : 'mb-2'
            )}
          >
            {label}

            {props.required && (
              <sup className="inline-block text-[13px] text-red-500 ltr:ml-1 rtl:mr-1">
                *
              </sup>
            )}
          </span>
        )}
        <input
          type={type}
          ref={ref}
          {...props}
          className={cn(
            'dark:bg-dark mt-1 block h-8 w-full rounded-md border border-gray-200 bg-white px-4 py-2  placeholder-gray-400 transition-shadow duration-200 invalid:border-red-500 invalid:text-red-600 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-500 dark:text-gray-100 dark:focus:border-gray-600 dark:focus:ring-gray-400 sm:h-10 sm:rounded',
            inputClassName
          )}
        />
        {props.icon && (
          <span className="absolute inset-y-12 right-8 top-10 flex items-center transition-all">
            {props.icon}
          </span>
        )}
      </label>
      {error && (
        <span role="alert" className="mt-1 block text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  )
);

Input.displayName = 'Input';
export default Input;
