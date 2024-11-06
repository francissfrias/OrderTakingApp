'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getPathnameBreadcrumbs } from '@/lib/helper';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import LoadingDots from '../ui/loaderdot';
import { MenuItem } from '@/lib/menu-items';

interface IHeader {
  menuItems: MenuItem[];
  menuSelectedKeys: string | undefined;
  title: string;
  loading: boolean;
}

export default function Header({
  menuItems,
  menuSelectedKeys,
  title,
  loading,
}: IHeader) {
  const pathname = getPathnameBreadcrumbs(title);

  return (
    <div className='flex h-16 items-center justify-between border-b bg-background px-4'>
      <div className='flex flex-row items-center justify-center gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='inline-block self-center w-8 md:hidden'
            >
              <MenuIcon className=' h-6 w-6' />
              <span className='sr-only'>Toggle notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            {menuItems.map((item) => {
              return (
                <Link
                  key={item.key}
                  href={item.key === '/' ? '/' : `/${item.key}`}
                >
                  <DropdownMenuItem
                    className={cn(
                      'flex flex-row gap-2',
                      menuSelectedKeys === item.key &&
                        'bg-accent text-accent-foreground'
                    )}
                  >
                    {item.icon} {item.label}
                  </DropdownMenuItem>
                </Link>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Breadcrumb>
          <BreadcrumbList className='text-xl font-semibold'>
            {pathname?.title && pathname?.section && (
              <>
                <BreadcrumbItem className='font-normal'>
                  <BreadcrumbLink asChild>
                    <Link href={`/admin/${pathname?.path}`}>
                      {pathname?.title}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className='flex gap-1.5 items-end'>
                    {pathname?.section} {loading && <LoadingDots />}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
            {pathname?.title && !pathname?.section && (
              <BreadcrumbItem>
                <BreadcrumbPage className='flex gap-1.5 items-end'>
                  {pathname?.title} {loading && <LoadingDots />}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
