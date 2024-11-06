import { TableComponent } from '@/components/common/tableComponent';
import { ColumnDef } from '@tanstack/react-table';
import { Sku as SkuColumn } from './columns';
import { mappedDataTable } from '@/lib/helper';
import { Sku } from '@/lib/model/Sku';

const SkuTable = async ({
  columns,
  offset,
  pageSize,
}: {
  columns: ColumnDef<SkuColumn>[];
  offset: number;
  pageSize: number;
}) => {
  const sku = await Sku.find({
    isActive: true,
  })
    .collation({ locale: 'en' })
    .skip(offset)
    .limit(pageSize)
    .lean()
    .exec();

  const skuData = mappedDataTable(sku);

  if (skuData?.length === 0 || !skuData?.length) {
    return (
      <h1
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        No data found for sku
      </h1>
    );
  }

  return <TableComponent data={skuData} columns={columns} />;
};

export default SkuTable;
