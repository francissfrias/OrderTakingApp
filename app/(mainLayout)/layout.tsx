import { headers } from 'next/headers';
import { capitalize, getPathname } from '@/lib/helper';
import AdminLayoutComponent from '@/components/shared/Layout';

export const dynamic = 'force-dynamic';

async function getAdminMetadataPathname() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  const title = getPathname({
    str: pathname,
  });

  if (title) {
    return ` ${capitalize(title)}`;
  }
}

export async function generateMetadata() {
  const metadataName = await getAdminMetadataPathname();
  return {
    title: metadataName,
  };
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayoutComponent>{children}</AdminLayoutComponent>;
}
