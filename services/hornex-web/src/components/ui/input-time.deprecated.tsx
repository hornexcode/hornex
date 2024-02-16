import { cn } from '@/lib/utils';
import * as React from 'react';

const timeRegex = /^[0-9]{1,2}:?[0-9]{1,2} ?(AM|PM)?$/;
const invalidTimeCharsRegex = /[^0-9 :apm]*/gi;
const MAX_OPTIONS = 100;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

type DateHour = {
  minutes: number;
  hours: number;
};

export type InputTimeProps = {
  stepTime?: DateHour;
  minTime?: DateHour;
  maxTime?: DateHour;
  setValue: (value: string) => void;
} & InputProps;

export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: (e: MouseEvent) => void
) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback(e);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};

// format any time that fits in the regex above to be in the default format for am/pm times (e.g. 9:00 AM)
// this function can also be used to convert 24h format to 12h
const formatTimeToAmPm = (input: string): string => {
  input = input.trim().toUpperCase();
  if (input === '') {
    return '';
  }

  if (!timeRegex.test(input)) {
    return input;
  }

  let period = 'AM';
  const matchPeriod = /AM|PM/.exec(input);
  if (matchPeriod) {
    period = matchPeriod[0];
  }

  let time = input.replace(/[^0-9:]/g, '');
  if (input.indexOf(':') === -1) {
    switch (time.length) {
      case 2:
        time = parseInt(time) + ':00';
        break;
      case 3:
        time = parseInt(time[0]) + ':' + time.slice(1, 3);
        break;
      default:
        time = parseInt(time.slice(0, 2)) + ':' + time.slice(2, 4);
        break;
    }
  }

  let [hours, minutes] = time.split(':');

  if (parseInt(hours) > 23) {
    hours = '23';
  }

  const intHours = parseInt(hours);
  if (intHours >= 12) {
    hours = intHours > 12 ? (intHours - 12).toString() : hours;

    if (!matchPeriod || intHours > 12) {
      period = 'PM';
    }
  } else if (intHours === 0) {
    hours = '12';
  }

  if (minutes.length === 1) {
    minutes = '0' + minutes;
  } else if (parseInt(minutes) > 59) {
    minutes = '59';
  }

  return `${hours}:${minutes} ${period}`;
};

const InputTime = React.forwardRef<HTMLInputElement, InputTimeProps>(
  ({ className, type, ...props }, ref) => {
    const fieldsetRef = React.useRef<HTMLDivElement>(null);
    const [error, setError] = React.useState(false);
    const [showOptions, setShowOptions] = React.useState(false);

    useClickOutside(fieldsetRef, () => setShowOptions(false));
    const options = React.useMemo(() => {
      const stepTime = props.stepTime || {
        hours: 0,
        minutes: 30,
      };

      const minTime = props.minTime || {
        hours: 0,
        minutes: 0,
      };

      const maxTime = props.maxTime || {
        hours: 23,
        minutes: 59,
      };

      const options = [formatTimeToAmPm(`${minTime.hours}:${minTime.minutes}`)];

      let prevTime = minTime;
      for (let i = 0; i < MAX_OPTIONS; i++) {
        const time = {
          hours: prevTime.hours + stepTime.hours,
          minutes: prevTime.minutes + stepTime.minutes,
        };
        if (time.minutes >= 60) {
          time.minutes -= 60;
          time.hours += 1;
        }

        if (
          time.hours >= 24 ||
          time.hours > maxTime.hours ||
          (time.hours === maxTime.hours && time.minutes >= maxTime.minutes)
        ) {
          break;
        }

        options.push(formatTimeToAmPm(`${time.hours}:${time.minutes}`));
        prevTime = time;
      }

      if (
        minTime.hours !== maxTime.hours ||
        minTime.minutes !== maxTime.minutes
      ) {
        options.push(formatTimeToAmPm(`${maxTime.hours}:${maxTime.minutes}`));
      }

      return options;
    }, [props.stepTime, props.minTime, props.maxTime]);

    return (
      <div>
        <input
          type={type}
          maxLength={8}
          autoComplete="off"
          className={cn(
            'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          onClick={() => setShowOptions(true)}
          onBlur={(e) => {
            if (timeRegex.test(e.target.value)) {
              e.target.value = formatTimeToAmPm(e.target.value);
              setError(false);
            } else if (e.target.value) {
              setError(true);
            }

            props.setValue(e.target.value);
            if (props.onBlur) {
              props.onBlur(e);
            }
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setError(false);
            e.target.value = e.target.value
              .replace(invalidTimeCharsRegex, '')
              .toUpperCase();
            props.setValue(e.target.value);
            if (props.onChange) {
              props.onChange(e);
            }
          }}
          ref={ref}
          {...props}
        />
        {showOptions && (
          <div
            className="border-soft-black-tint absolute z-10 max-h-52 w-full min-w-[112px] overflow-auto rounded border bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)]"
            data-cy="input-time-options"
          >
            {options.map((option) => (
              <div
                key={option}
                className="border-soft-black-tint hover:bg-interactive-tertiary-hover flex h-9 cursor-pointer border-b px-4 py-2"
                onClick={() => {
                  props.setValue(option);
                  setShowOptions(false);
                }}
              >
                <span className="p-utility-navigation font-book uppercase tabular-nums">
                  {option}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

InputTime.displayName = 'InputTime';

export { InputTime };
