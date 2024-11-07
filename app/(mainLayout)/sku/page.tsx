import { Suspense } from 'react';
import TablePagination from '@/components/common/tablePagination';
import SkuTable from './_components/table';
import skuColumn from './_components/columns';
import CreateSkuForm from './_components/createForm';

export default async function SkuPage() {
  const currentPage = 1;
  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  return (
    <>
      <div className='flex flex-row items-center justify-end  gap-4 py-2 px-1'>
        <CreateSkuForm />
      </div>
      <Suspense fallback={<h1>Loading...</h1>}>
        <SkuTable columns={skuColumn} pageSize={pageSize} offset={offset} />
      </Suspense>
      <TablePagination
        pageSize={pageSize}
        currentPage={currentPage}
        totalLength={8}
      />
    </>
  );
}
