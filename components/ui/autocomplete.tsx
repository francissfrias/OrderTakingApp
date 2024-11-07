'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { forwardRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface AutocompleteProps {
  name: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  warning?: boolean;
}

const Autocomplete = forwardRef<HTMLDivElement, AutocompleteProps>(
  ({ name, options, placeholder, disabled, readOnly, warning }, ref) => {
    const { control } = useFormContext();
    const [open, setOpen] = useState(false);

    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const currentOption = options?.find(
            (option) => option.value === field.value
          );

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger className='flex w-full' asChild>
                <Button
                  variant='outline'
                  role='Autocomplete'
                  aria-expanded={open}
                  disabled={disabled}
                  className={cn(
                    'justify-between font-normal w-full',
                    !field.value && 'text-gray-400 ',
                    readOnly && 'cursor-not-allowed disabled:opacity-100',
                    warning && 'ring-1 ring-yellow-200'
                  )}
                >
                  {currentOption ? currentOption?.label : placeholder}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0' align='start'>
                <Command ref={ref}>
                  <CommandInput placeholder={placeholder} />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {options?.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={(currentValue) => {
                            setOpen(false);
                            if (currentValue === field.value) return;
                            field.onChange(option.value);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value === option.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />
    );
  }
);

Autocomplete.displayName = 'Autocomplete';

export { Autocomplete };
