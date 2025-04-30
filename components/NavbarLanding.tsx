'use client';
import React, { useEffect } from 'react';
import { Logo } from './Logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/lib/ThemeToggle';
import { UserButton, useUser } from '@clerk/nextjs';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';
import { DialogTitle } from './ui/dialog';

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
      <div className='hidden border-separate border-b md:block  right-0 left-0 z-50  dark:bg-gray-950 bg-gray-300 fixed top-0'>
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

      {/* Mobile Navbar */}
      <div className='block    md:hidden  fixed top-0 left-0 right-0  dark:bg-gray-950 bg-gray-300'>
        <nav className='flex  px-6 h-[60px] min-h-[60px] items-center justify-between w-full'>
          {/* links */}
          <div className='flex justify-center items-center w-full gap-4'>
            <Logo />
          </div>
        </nav>
      </div>
    </>
  );
}
