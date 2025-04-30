'use client';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Spacer } from '@/components/ui/spacer';
import { MAX_DATE_RANGE_DAYS } from '@/lib/consts';
import { useQuery } from '@tanstack/react-query';
import { differenceInDays, startOfMonth } from 'date-fns';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import { TableComponent } from './TableComponent';
import { TransactionHistoryType } from '@/app/api/history/history-transactions/route';

export function TransactionsTable() {
  const [dateRange, setDateRange] = React.useState<{
    from: Date;
    to: Date;
  }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const [page, setPage] = React.useState(1);

  const { data: transactionsQueryData, isPending: isPendingTransactions } =
    useQuery<TransactionHistoryType>({
      queryKey: ['transactions', dateRange.from, dateRange.to, page],
      queryFn: async () => {
        const response = await fetch(
          `/api/history/history-transactions?page=${page}&from=${dateRange.from}&to=${dateRange.to}`
        );

        if (response.status !== 200) {
          return toast.error(
            response.statusText
              ? response.statusText
              : 'Something went wrong, please try again',
            {
              id: 'transactions',
            }
          );
        }

        return response.json();
      },
    });

  function handleDateRangeChange(dateRange: {
    range: DateRange;
    rangeCompare?: DateRange;
  }) {
    if (!dateRange.range.from || !dateRange.range.to) {
      return;
    }
    if (
      differenceInDays(dateRange.range.to, dateRange.range.from) >
      MAX_DATE_RANGE_DAYS
    ) {
      return toast.error(
        `The selected range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days.`
      );
    }
    setDateRange({ from: dateRange.range.from, to: dateRange.range.to });
  }

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between lg:items-center md:items-center lg:flex-row md:flex-row flex-col gap-4'>
        <div>
          <h2 className='text-3xl font-bold'>Transactions history</h2>
          <p className='text-sm text-gray-400 '>Manage your transactions.</p>
        </div>
        <Spacer lg={12} md={6} sm={6} />
        <DateRangePicker
          onUpdate={(values) => handleDateRangeChange(values)}
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          align='end'
          locale='ro-RO'
          showCompare={false}
        />
      </div>
      <Spacer lg={12} md={6} sm={6} />
      <TableComponent
        setPage={setPage}
        page={page}
        data={transactionsQueryData}
      />
    </div>
  );
}
