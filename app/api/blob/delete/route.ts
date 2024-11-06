import { del } from '@vercel/blob';
import { NextRequest } from 'next/server';

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const urlToDelete = searchParams.get('url');

  if (urlToDelete === '' || urlToDelete === null)
    return new Response('No url to delete');

  if (urlToDelete.includes('blob.vercel')) {
    await del(urlToDelete);
    return new Response('Image Deleted');
  }
  return new Response('Invalid url to delete');
}
