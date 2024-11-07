import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { createPurchaseOrder } from '@/schema/purchaseOrder';
import { PurchaseOrder } from '@/lib/model/PurchaseOrder';
import { PurchaseItem } from '@/lib/model/PurchaseItem';

const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const validatePurchaseOrder = createPurchaseOrder.parse(body);

    if (!validatePurchaseOrder) {
      return NextResponse.json(
        { error: 'Invalid Purchase Order' },
        { status: 400 }
      );
    }

    const result = await PurchaseOrder.create({
      ...validatePurchaseOrder,
      dateCreated: Date.now(),
      timestamp: Date.now(),
      isActive: true,
    });

    const purchaseItems = result.cartOrders?.map((item) => {
      return {
        skuId: item.skuId,
        quantity: item.quantity,
        price: item.price,
        purchaseOrderId: result._id,
      };
    });

    await PurchaseItem.insertMany(purchaseItems);

    revalidatePath('/');

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.log(error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors.map((err) => err.message).join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong...' },
      { status: 500 }
    );
  }
};

export { POST };
