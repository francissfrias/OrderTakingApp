import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { ObjectId } from 'mongodb';
import { Sku } from '@/lib/model/Sku';
import { updateSku } from '@/schema/sku';
import { put } from '@vercel/blob';

const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const results = await Sku.findOne({ _id: new ObjectId(id) })
      .lean()
      .exec();
    const modifiedResults = {
      ...results,
      unitPrice: results?.unitPrice.toString(),
    };

    console.log(modifiedResults);

    if (!results)
      return NextResponse.json(
        { error: 'No customer found with this id' },
        { status: 404 }
      );

    return NextResponse.json(modifiedResults);
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

    const results = await Sku.findOne(
      { _id: new ObjectId(id) },
      { _id: 0, name: 1, code: 1 }
    ).exec();

    if (!results)
      return NextResponse.json(
        { error: 'No customer found with this id' },
        { status: 404 }
      );

    const formData = await req.formData();

    const body = Object.fromEntries(formData.entries());

    const modifiedBody = {
      ...body,
      imageUrl: JSON.parse(body.imageUrl as string),
    };

    const validateSku = updateSku.parse(modifiedBody);

    if (!validateSku) {
      return NextResponse.json({ error: 'Invalid Sku' }, { status: 400 });
    }

    const existingNameSku = await Sku.findOne({
      name: results.name,
      _id: { $ne: new ObjectId(id) },
    });

    const existingCodeSku = await Sku.findOne({
      code: results.code,
      _id: { $ne: new ObjectId(id) },
    });

    if (existingNameSku) {
      return NextResponse.json(
        {
          error: 'Sku with the same name already exists',
        },
        { status: 400 }
      );
    }

    if (existingCodeSku) {
      return NextResponse.json(
        {
          error: 'Sku with the same code already exists',
        },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File | null;
    const filename = formData.get('filename') as string | null;

    if (!filename || !file) {
      return NextResponse.json(
        { error: 'Filename and file are required' },
        { status: 400 }
      );
    }

    const blob = await put(filename, file, {
      access: 'public',
    });

    const modifiedData = {
      ...validateSku,
      imageUrl: [
        {
          url: blob.url,
          name: validateSku.imageUrl?.[0]?.name ?? '',
          lastModified: validateSku.imageUrl?.[0]?.lastModified ?? '',
          lastModifiedDate: validateSku.imageUrl?.[0]?.lastModifiedDate ?? '',
          size: validateSku?.imageUrl?.[0]?.size ?? '',
          type: validateSku?.imageUrl?.[0]?.type ?? '',
        },
      ],
    };
    const result = await Sku.updateOne(
      {
        _id: new ObjectId(id),
      },
      modifiedData
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
