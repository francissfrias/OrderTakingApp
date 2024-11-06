import { BlobAccessError, put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.formData();

  const filename = body.get('filename') as string | null;
  const file = body.get('file') as string | null;

  if (!filename || !file) {
    return NextResponse.json(
      { error: 'Filename and file are required' },
      { status: 400 }
    );
  }

  try {
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    if (error instanceof BlobAccessError) {
      console.log(error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: 'Atypical error detected, see log for details' },
        { status: 400 }
      );
    }
  }
}
