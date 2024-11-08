import { TableComponent } from '@/components/common/tableComponent';
import { mappedDataTable } from '@/lib/helper';
import { Customer } from '@/lib/model/Customer';
import { ColumnDef } from '@tanstack/react-table';
import { Customer as CustomerColumn } from './columns';

interface ICustomerTable {
  columns: ColumnDef<CustomerColumn>[];
  offset: number;
  pageSize: number;
}

const CustomersTable = async ({
  columns,
  offset,
  pageSize,
}: ICustomerTable) => {
  const customer = await Customer.find({})
    .collation({ locale: 'en' })
    .skip(offset)
    .limit(pageSize)
    .lean()
    .exec();

  const customerData = mappedDataTable(customer);

  if (customerData?.length === 0 || !customerData?.length) {
    return (
      <h1
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        No data found for customers
      </h1>
    );
  }

  return <TableComponent data={customerData} columns={columns} />;
};

export default CustomersTable;
