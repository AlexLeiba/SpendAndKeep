import { SignOutButton, UserButton } from '@clerk/nextjs';
import React from 'react';

function DashboardPage() {
  return (
    <div>
      page <SignOutButton />
      <UserButton />
    </div>
  );
}

export default DashboardPage;
