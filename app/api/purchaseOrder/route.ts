import { PurchaseItem } from '@/lib/model/PurchaseItem';
import { PurchaseOrder } from '@/lib/model/PurchaseOrder';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const result = await PurchaseOrder.create({
      ...body,
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

    revalidatePath('/orders');

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
