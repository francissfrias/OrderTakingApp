'use client';

import { ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

export type PurchaseOrder = {
  _id: string;
  customerName: string;
  dateOfDelivery: Date;
  status: string;
  amountDue: number;
  isActive: boolean;
};

const columns: ColumnDef<PurchaseOrder>[] = [
  {
    id: 'customerName',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Customer Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.customerName}</p>,
  },

  {
    accessorKey: 'dateOfDelivery',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Delivery Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => (
      <p>{cell.row.original.dateOfDelivery.toLocaleDateString()}</p>
    ),
  },

  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.status}</p>,
  },
  {
    accessorKey: 'amountDue',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount Due
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.amountDue}</p>,
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

  // {
  //   header: 'Actions',
  //   id: 'actions',
  //   enableHiding: false,
  //   cell: (cell) => {
  //     return (
  //       <div className='flex flex-row gap-2'>
  //         <UpdateSkuForm id={cell.row.original._id} />
  //       </div>
  //     );
  //   },
  // },
];

export default columns;
