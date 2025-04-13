'use client';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { UserSettings } from '@prisma/client';
import { startOfMonth } from 'date-fns';
import React from 'react';
import { DateRange } from 'react-day-picker';

export function OverviewSection({
  userSettings,
}: {
  userSettings: UserSettings;
}) {
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  function handleDateRangeChange(dateRange: {
    range: DateRange;
    rangeCompare?: DateRange;
  }) {
    setDateRange({ from: dateRange.range.from, to: dateRange.range.to });
  }

  return (
    <div>
      <DateRangePicker
        onUpdate={(values) => handleDateRangeChange(values)}
        initialDateFrom={dateRange.from}
        initialDateTo={dateRange.to}
        align='start'
        locale='ro-RO'
        showCompare={false}
      />
    </div>
  );
}
