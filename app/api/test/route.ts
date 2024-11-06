import { Neighborhood } from '@/lib/model/Neighborhood';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const neighborData = await Neighborhood.find({}, { name: 1 });

    return NextResponse.json(neighborData);
  } catch (error) {
    console.log(error);
    return NextResponse.json([]);
  }
}
