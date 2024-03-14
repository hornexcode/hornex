'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import * as React from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';

export function DatePicker({
  date,
  onSelect,
  className,
}: {
  date: Date;
  onSelect: SelectSingleEventHandler;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'border-muted bg-background hover:bg-dark h-10 w-[240px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="text-title mr-2 h-4 w-4" />
            {date ? (
              <span className="">{format(date, 'PPP')}</span>
            ) : (
              <span className="">Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-border font-display w-auto rounded-lg p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            initialFocus
            disabled={(date) =>
              date <= new Date() || date < new Date('1900-01-01')
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
