import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Navbar } from '@/components/Navbar';

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
    <ClerkProvider>
      <html lang='en' className=''>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-background dark:text-white`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
