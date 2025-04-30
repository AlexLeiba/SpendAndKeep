import { TransactionsTable } from '@/components/PageSections/Transactions/TransactionsTable';
import { Spacer } from '@/components/ui/spacer';
import React from 'react';

function TransactionsPage() {
  return (
    <div>
      <Spacer lg={6} md={6} size={3} />

      <TransactionsTable />
    </div>
  );
}

export default TransactionsPage;
