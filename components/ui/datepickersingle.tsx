'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerSingleProps extends UseControllerProps {
  name: string;
}

export const DatePickerSingle = React.forwardRef<
  HTMLButtonElement,
  DatePickerSingleProps
>(({ name, control }, ref) => {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon />
          {value ? format(new Date(value), 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            if (date) onChange(date);
          }}
          initialFocus
          disabled={(date) => date < new Date()}
        />
      </PopoverContent>
    </Popover>
  );
});

DatePickerSingle.displayName = 'DatePickerSingle';
