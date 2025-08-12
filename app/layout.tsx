import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spend||Keep",
  description:
    "Spend or keep is a budget tracker app that helps you track your expenses and stay on top of your budget.",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://spend-or-keep.vercel.app/",
    title: "Spend||Keep",
    description:
      "Spend or keep is a budget tracker web app that helps you track your expenses and stay on top of your budget.",
    images: [
      {
        url: "https://res.cloudinary.com/deixj28ym/image/upload/v1754381004/travel-plan/m8w8ykg507evpnasawte.webp",
        width: 1200,
        height: 630,
        alt: "Spend||Keep",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <ClerkProvider afterSignOutUrl={"/sign-in"}>
        <html lang="en" className="">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-background dark:text-white`}
          >
            <Navbar />
            {children}
          </body>
        </html>
      </ClerkProvider>

      <Toaster position="bottom-right" />
    </QueryProvider>
  );
}
