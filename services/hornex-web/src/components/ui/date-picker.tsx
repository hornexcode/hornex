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
              'border-border bg-medium-dark hover:bg-dark w-[240px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="text-brand mr-2 h-4 w-4" />
            {date ? (
              <span className="text-title">{format(date, 'PPP')}</span>
            ) : (
              <span className="text-muted">Pick a date</span>
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
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
