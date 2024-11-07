import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Customer } from '@/lib/model/Customer';
import { ZodError } from 'zod';
import { ObjectId } from 'mongodb';

const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const results = await Customer.findOne({ _id: new ObjectId(id) }).exec();

    if (!results)
      return NextResponse.json(
        { error: 'No customer found with this id' },
        { status: 404 }
      );

    return NextResponse.json(results);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: 'Atypical error detected, see log for details' },
      { status: 400 }
    );
  }
};

const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    console.log(id);

    const results = await Customer.findOne(
      { _id: new ObjectId(id) },
      {
        _id: 0,
        firstName: 1,
        lastName: 1,
        mobileNumber: 1,
      }
    ).exec();

    if (!results)
      return NextResponse.json(
        { error: 'No customer found with this id' },
        { status: 404 }
      );

    const body = await req.json();

    const existingMobileNumberCustomer = await Customer.findOne({
      mobileNumber: results.mobileNumber,
      _id: { $ne: new ObjectId(id) },
    });

    console.log(existingMobileNumberCustomer);

    const existingNameCustomer = await Customer.findOne({
      firstName: results.firstName,
      lastName: results.lastName,
      _id: { $ne: new ObjectId(id) },
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

    const result = await Customer.updateOne(
      {
        _id: new ObjectId(id),
      },
      body
    );

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



export { GET, PATCH };
