import { TransactionsTable } from '@/components/PageSections/Transactions/TransactionsTable';
import { Spacer } from '@/components/ui/spacer';
import React from 'react';

function TransactionsPage() {
  return (
    <div>
      <Spacer size={6} />

      <TransactionsTable />
    </div>
  );
}

export default TransactionsPage;
