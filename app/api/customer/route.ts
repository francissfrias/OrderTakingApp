import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Customer } from '@/lib/model/Customer';
import { createCustomer, CreateCustomerSchema } from '@/schema/customer';
import { ZodError } from 'zod';

const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const validateCustomer = createCustomer.parse(body);

    if (!validateCustomer) {
      return NextResponse.json({ error: 'Invalid Customer' }, { status: 400 });
    }

    const existingMobileNumberCustomer = await Customer.findOne({
      mobileNumber: body.mobileNumber,
    });

    const existingNameCustomer = await Customer.findOne({
      firstName: body.firstName,
      lastName: body.lastName,
    });

    if (existingMobileNumberCustomer) {
      return NextResponse.json(
        {
          error: 'Customer with the mobile number already exists',
        },
        { status: 400 }
      );
    }

    if (existingNameCustomer) {
      return NextResponse.json(
        {
          error: 'Customer with the same name already exists',
        },
        { status: 400 }
      );
    }

    const result: CreateCustomerSchema = await Customer.create({
      ...validateCustomer,
      dateCreated: Date.now(),
      timestamp: Date.now(),
      isActive: true,
    });

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
