import {
  HelloTopSection,
  OverviewSection,
  HistorySection,
} from '@/components/PageSections/Dashboard';
import { Spacer } from '@/components/ui/spacer';
import { prismaDB } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }
  console.log('🚀 ~ DashboardPage ~ user:\n\n\n', user);

  const userSettings = await prismaDB.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect('/wizard');
  }

  return (
    <div>
      {/* HELLO TOP SECTION*/}
      <HelloTopSection />
      <Spacer lg={12} md={6} sm={6} />

      {/* OVERVIEW SECTION */}
      <OverviewSection userSettings={userSettings} />
      <Spacer lg={12} md={6} sm={6} />

      {/* HISTORY SECTION */}
      <HistorySection userSettings={userSettings} />
      <Spacer lg={12} md={6} sm={6} />
    </div>
  );
}

export default DashboardPage;
