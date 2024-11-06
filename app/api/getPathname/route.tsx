import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const pathname = body.pathname;

  return NextResponse.json({ title: pathname }, { status: 200 });
};
