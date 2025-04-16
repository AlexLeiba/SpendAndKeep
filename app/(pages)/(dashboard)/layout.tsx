import { Navbar } from '@/components/Navbar';
import { Spacer } from '@/components/ui/spacer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=''>
      <Navbar />

      <div className='px-8 max-w-5xl mx-auto h-screen mt-[65px]'>
        {children}
      </div>
    </div>
  );
}
