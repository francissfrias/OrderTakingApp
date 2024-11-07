import { Sku } from '@/lib/model/Sku';
import { createSku } from '@/schema/sku';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();

    const body = Object.fromEntries(formData.entries());

    const modifiedBody = {
      ...body,
      imageUrl: JSON.parse(body.imageUrl as string),
    };

    const validateSku = createSku.parse(modifiedBody);

    if (!validateSku) {
      return NextResponse.json({ error: 'Invalid Sku' }, { status: 400 });
    }

    const existingNameSku = await Sku.findOne({
      name: body.name,
    });

    const existingCodeSku = await Sku.findOne({
      code: body.code,
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
          name: validateSku.imageUrl[0].name,
          lastModified: validateSku.imageUrl[0].lastModified,
          lastModifiedDate: validateSku.imageUrl[0].lastModifiedDate,
          size: validateSku.imageUrl[0].size,
          type: validateSku.imageUrl[0].type,
        },
      ],
    };

    const result = await Sku.create({
      ...modifiedData,
      dateCreated: Date.now(),
      timestamp: Date.now(),
      isActive: true,
    });

    revalidatePath('/sku');

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
