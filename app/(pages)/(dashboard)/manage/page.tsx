import { Categories, Currency } from '@/components/PageSections/Manage';
import { Spacer } from '@/components/ui/spacer';
import React from 'react';

function ManagePage() {
  return (
    <div>
      <Spacer size={6} />
      <h2 className='text-3xl font-bold'>Manage</h2>
      <p className='text-sm text-gray-300 '>Manage your categories.</p>
      <Spacer lg={12} md={6} sm={6} />

      {/* CURRENCY */}
      <Currency />
      <Spacer lg={12} md={6} sm={6} />

      {/* CATEGORIES */}
      <Categories />
      <Spacer lg={12} md={6} sm={6} />
      {/*  */}
    </div>
  );
}

export default ManagePage;
