'use client';
import React from 'react';
import { Logo } from './Logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/lib/ThemeToggle';
import { UserButton } from '@clerk/nextjs';

export function Navbar() {
  const pathname = usePathname();

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

      <div className='hidden border-separate border-b  dark:bg-background md:block  '>
        <nav className='glex items-center justify-between px-8'>
          <div className='flex h-[80px] min-h-[60px] items-center gap-x-8'>
            <Logo />

            {/* links */}
            <div className='flex w-full gap-4 items-center'>
              {linkItems.map((data, index) => {
                const isActive = pathname === data.href.toLowerCase();
                return (
                  <Link key={index} href={data.href} className='relative'>
                    <p
                      className={cn(
                        isActive ? 'font-bold' : 'font-medium',
                        '  text-gray-700 dark:text-gray-200 hover:text-primary'
                      )}
                    >
                      {data.label}
                    </p>
                    <div
                      className={cn(
                        isActive &&
                          'border-b-1 dark:border-white border-black absolute top-[52px] left-1/2 -translate-1/2 bottom-0  w-[120%] z-10'
                      )}
                    ></div>
                  </Link>
                );
              })}
            </div>

            <div className='flex items-center gap-4'>
              <ThemeToggle />
              <UserButton />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
