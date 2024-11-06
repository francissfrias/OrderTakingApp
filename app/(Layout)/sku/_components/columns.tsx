'use client';

import { ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import UpdateSkuForm from './updateForm';

export type Sku = {
  _id: string;
  name: string;
  code: string;
  unitPrice: number;
  imageUrl: { url: string }[];
  isActive: boolean;
};

const columns: ColumnDef<Sku>[] = [
  {
    id: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.name}</p>,
  },

  {
    accessorKey: 'code',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Code
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.code}</p>,
  },

  {
    accessorKey: 'unitPrice',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Unit Price
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: (cell) => <p>{cell.row.original.unitPrice}</p>,
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
    id: 'imageUrl',
    header: () => {
      return <Button variant='ghost'>Image</Button>;
    },
    cell: (cell) => (
      <div>
        <Image
          src={cell.row.original.imageUrl[0]?.url as string}
          width={50}
          height={50}
          className='rounded-full m-auto aspect-square'
          alt='Product Image'
        />
      </div>
    ),
  },

  {
    header: 'Actions',
    id: 'actions',
    enableHiding: false,
    cell: (cell) => {
      return (
        <div className='flex flex-row gap-2'>
          <UpdateSkuForm id={cell.row.original._id} />
        </div>
      );
    },
  },
];

export default columns;
