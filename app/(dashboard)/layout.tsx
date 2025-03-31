export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='relative flex h-screen w-full flex-col'>
      <div className='w-full'>{children}</div>
    </div>
  );
}
