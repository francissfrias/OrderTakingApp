import { Suspense } from 'react';
import TablePagination from '@/components/common/tablePagination';
import purchaseOrderColumn from './_components/columns';
import PurchaseOrderTable from './_components/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function PurchaseOrderPage() {
  const currentPage = 1;
  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  return (
    <>
      <div className='flex flex-row items-center justify-end  gap-4 py-2 px-1'>
        <Button variant='outline' asChild>
          <Link href='/orders/createOrder'>Create Order</Link>
        </Button>
      </div>
      <Suspense fallback={<h1>Loading...</h1>}>
        <PurchaseOrderTable
          columns={purchaseOrderColumn}
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
