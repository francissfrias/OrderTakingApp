'use client';
import { userDefaultMenuItems } from '@/lib/menu-items';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setLoading(true);
    const getPathname = async () => {
      try {
        const data = await fetch('/api/getPathname', {
          method: 'POST',
          body: JSON.stringify({ pathname }),
          cache: 'no-store',
        });
        const result = await data.json();
        return result.title;
      } catch (error) {
        console.error('Error fetching pathname:', error);
      }
    };
    getPathname()
      .then((data) => setTitle(data))
      .finally(() => setLoading(false));
  }, [pathname]);

  const menuSelectedKeys =
    pathname.split('/').length > 3
      ? pathname.split('/')[2]
      : pathname.split('/').pop();

  return (
    <Sidebar
      menuItems={userDefaultMenuItems}
      menuSelectedKeys={menuSelectedKeys}
    >
      <Header
        menuItems={userDefaultMenuItems}
        menuSelectedKeys={menuSelectedKeys}
        title={title}
        loading={loading}
      />
      <div className='p-2 h-full '>{children}</div>
    </Sidebar>
  );
}
