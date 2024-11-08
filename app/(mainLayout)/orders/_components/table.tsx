import { TableComponent } from '@/components/common/tableComponent';
import { mappedDataTable } from '@/lib/helper';
import { PurchaseOrder } from '@/lib/model/PurchaseOrder';
import { ColumnDef } from '@tanstack/react-table';
import { PurchaseOrder as PurchaseOrderColumn } from './columns';

interface IPurchaseOrderTable {
  columns: ColumnDef<PurchaseOrderColumn>[];
  offset: number;
  pageSize: number;
}

const PurchaseOrderTable = async ({
  columns,
  offset,
  pageSize,
}: IPurchaseOrderTable) => {
  const purchaseOrder = await PurchaseOrder.find({})
    .collation({ locale: 'en' })
    .skip(offset)
    .limit(pageSize)
    .lean()
    .exec();

  const purchaseOrderData = mappedDataTable(purchaseOrder);

  if (purchaseOrderData?.length === 0 || !purchaseOrderData?.length) {
    return (
      <h1
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        No data found for Purchase Order
      </h1>
    );
  }

  return <TableComponent data={purchaseOrderData} columns={columns} />;
};

export default PurchaseOrderTable;
