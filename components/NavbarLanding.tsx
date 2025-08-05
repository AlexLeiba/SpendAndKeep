'use client';
import React from 'react';
import { Logo } from './Logo';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/lib/ThemeToggle';

export function NavbarLanding() {
  const pathname = usePathname();
  const [isOpenedMenu, setIsOpenedMenu] = React.useState(false);

  const linkItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      label: 'Transactions',
      href: '/transactions',
    },
    {
      label: 'Manage',
      href: '/manage',
    },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <div className=' border-separate border-b md:block  right-0 left-0 z-50  dark:bg-gray-950 bg-gray-300 fixed top-0'>
        <div className=' max-w-5xl mx-auto  '>
          <nav className='glex items-center justify-between px-8'>
            <div className='flex h-[65px] min-h-[60px] items-center gap-x-8 justify-between'>
              <Logo />

              <div className='flex items-center gap-4'>
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
