import { Sku } from '@/lib/model/Sku';
import CreatePurchaseOrderForm from '../_components/createForm';
import { Customer } from '@/lib/model/Customer';

export default async function CreatePurchaseOrderPage() {
  const customer = await Customer.find(
    {
      isActive: true,
    },
    {
      firstName: 1,
      lastName: 1,
      _id: 1,
    }
  )
    .lean()
    .exec();

  const customerData = customer.map((item) => ({
    _id: item._id.toString(),
    value: item._id.toString(),
    label: `${item.firstName} ${item.lastName}`,
  }));

  const productItems = await Sku.find({
    isActive: true,
  })
    .lean()
    .exec();

  const productItemsData = productItems.map((item) => ({
    _id: item._id.toString(),
    name: item.name,
    code: item.code,
    price: item.unitPrice,
    image: item.imageUrl[0]?.url || '',
  }));

  return (
    <>
      <CreatePurchaseOrderForm
        productItems={productItemsData}
        customerItems={customerData}
      />
    </>
  );
}
