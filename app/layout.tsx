import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

import QueryProvider from '@/components/providers/QueryProvider';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { NavbarLanding } from '@/components/NavbarLanding';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Spend&Keep',
  description:
    'Spend and keep is a budget tracker app that helps you track your expenses and stay within your budget.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <ClerkProvider afterSignOutUrl={'/sign-in'}>
        <html lang='en' className=''>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-background dark:text-white`}
          >
            <NavbarLanding />
            {children}
          </body>
        </html>
      </ClerkProvider>

      <Toaster position='bottom-right' />
    </QueryProvider>
  );
}
