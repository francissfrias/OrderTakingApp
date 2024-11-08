'use client';

import { ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import UpdateCustomerForm from './updateForm';

export type Customer = {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  city: string;
  isActive: boolean;
};

const columns: ColumnDef<Customer>[] = [
  {
    id: 'fullname',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fullname
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => (
      <p>
        {cell.row.original.lastName}, {cell.row.original.firstName}
      </p>
    ),
  },

  {
    accessorKey: 'mobilenumber',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Mobile Number
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.mobileNumber}</p>,
  },

  {
    accessorKey: 'city',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          City
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.city}</p>,
  },

  {
    accessorKey: 'isActive',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          isActive
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.isActive ? 'Yes' : 'No'}</p>,
  },

  {
    header: 'Actions',
    id: 'actions',
    enableHiding: false,
    cell: (cell) => {
      return (
        <div className='flex flex-row gap-2'>
          <UpdateCustomerForm id={cell.row.original._id} />
        </div>
      );
    },
  },
];

export default columns;
