'use client';

import { MenuItem } from '@/lib/menu-items';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ISiderbar {
  children: React.ReactNode;
  menuItems: MenuItem[];
  menuSelectedKeys: string | undefined;
}

export default function Sidebar({
  children,
  menuItems,
  menuSelectedKeys,
}: ISiderbar) {
  return (
    <>
      <div className='hidden min-h-dvh md:grid md:grid-cols-[125px_1fr] bg-background lg:grid-cols-[280px_1fr] '>
        <div className='border-r bg-muted/40 p-4'>
          <nav className='flex flex-col justify-between'>
            <div className='flex-1 flex flex-col gap-2'>
              {menuItems.map((item) => {
                return (
                  <Link
                    prefetch={true}
                    key={item.key}
                    href={item.key === '/' ? '/' : `/${item.key}`}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                      menuSelectedKeys === item.key &&
                        'bg-accent text-accent-foreground'
                    )}
                  >
                    <div className='hidden lg:inline-block m-0'>
                      {item.icon}
                    </div>
                    <p>{item.label}</p>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
        <div className='flex flex-col'>{children}</div>
      </div>
      <div className='block md:hidden'>{children}</div>
    </>
  );
}
