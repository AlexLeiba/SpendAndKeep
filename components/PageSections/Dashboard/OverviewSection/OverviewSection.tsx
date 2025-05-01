'use client';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Spacer } from '@/components/ui/spacer';
import { UserSettings } from '@prisma/client';
import { differenceInDays, startOfMonth } from 'date-fns';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { TransactionsBalance } from './TransactionsBalance';
import { toast } from 'sonner';
import { MAX_DATE_RANGE_DAYS } from '@/lib/consts';

export function OverviewSection({
  userSettings,
}: {
  userSettings: UserSettings;
}) {
  const [dateRange, setDateRange] = React.useState<{
    from: Date;
    to: Date;
  }>({
    from: startOfMonth(new Date()),
    to: new Date(),
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
    <div>
      <div className='flex justify-between lg:items-center md:items-center lg:flex-row md:flex-row flex-col gap-4'>
        <h2 className='text-3xl font-bold'>Overview</h2>

        <DateRangePicker
          onUpdate={(values) => handleDateRangeChange(values)}
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          align='end'
          locale='ro-RO'
          showCompare={false}
        />
      </div>

      <Spacer size={6} />

      <TransactionsBalance
        currency={userSettings?.currency}
        from={dateRange.from}
        to={dateRange.to}
      />
    </div>
  );
}
