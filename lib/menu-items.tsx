import { ShoppingBag, ShoppingCart, UsersRound } from 'lucide-react';

export interface MenuItem {
  label: string;
  key: string;
  icon: React.ReactNode;
}

export const userDefaultMenuItems: MenuItem[] = [
  {
    label: 'Customer',
    key: '/',
    icon: <UsersRound className='h-4 w-4' />,
  },
  {
    label: 'SKU',
    key: 'sku',
    icon: <ShoppingBag className='h-4 w-4' />,
  },
  {
    label: 'Orders',
    key: 'orders',
    icon: <ShoppingCart className='h-4 w-4' />,
  },
];
