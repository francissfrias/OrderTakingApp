import { Metadata } from 'next';
import { Suspense } from 'react';
// import SkeletonTable from '@/app/admin/_components/SkeletonTable'
import Link from 'next/link';
import { cn } from '@/lib/utils';
import TablePagination from '@/components/common/tablePagination';
import CustomersTable from './_components/table';
import customerColumn from '@/app/(Layout)/_components/columns';

export const metadata: Metadata = {
  title: 'Customer Page',
};
export default async function CustomerPage() {
  const currentPage = 1;
  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  return (
    <>
      <div className='flex flex-row items-center justify-end  gap-4 py-2 px-1'>
        <Link
          href={'/createCustomer'}
          className={cn(
            'rounded-md px-4 py-2 text-muted-foreground text-nowrap  transition-colors  ring-1 ring-gray-200 bg-white hover:bg-accent hover:text-accent-foreground '
          )}
        >
          Create Customer
        </Link>
      </div>
      <Suspense fallback={<h1>Loading...</h1>}>
        <CustomersTable
          columns={customerColumn}
          pageSize={pageSize}
          offset={offset}
        />
      </Suspense>
      <TablePagination
        pageSize={pageSize}
        currentPage={currentPage}
        totalLength={8}
      />
    </>
  );
}
