import { Navbar } from '@/components/Navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=''>
      <Navbar />
      <div className='w-full max-w-5xl mx-auto h-screen'>{children}</div>
    </div>
  );
}
