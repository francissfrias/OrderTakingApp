import { TableComponent } from '@/components/common/tableComponent';
import { mappedDataTable } from '@/lib/helper';
import { Sku } from '@/lib/model/Sku';
import { ColumnDef } from '@tanstack/react-table';
import { Sku as SkuColumn } from './columns';

interface ISkuTable {
  columns: ColumnDef<SkuColumn>[];
  offset: number;
  pageSize: number;
}

const SkuTable = async ({ columns, offset, pageSize }: ISkuTable) => {
  const sku = await Sku.find({})
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
