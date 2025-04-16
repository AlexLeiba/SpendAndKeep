'use client';
import React from 'react';
import { PeriodType, TimeframeType } from '@/lib/types';
import { UserSettings } from '@prisma/client';
import { GetFormatterForCurrency } from '@/lib/helpers';
import { Spacer } from '@/components/ui/spacer';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HistoryPeriodSelector } from './HistoryPeriodSelector';

export function HistorySection({
  userSettings,
}: {
  userSettings: UserSettings;
}) {
  const [timeframe, setTimeframe] = React.useState<TimeframeType>('month');
  const [period, setPeriod] = React.useState<PeriodType>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const formatter = React.useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div>
      <h2 className='text-3xl font-bold'>History</h2>
      <Spacer size={6} />

      <Card className='rounded-md '>
        <CardHeader className='flex justify-between'>
          <div>
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />
          </div>

          <div className='flex gap-2'>
            <div>
              <Badge className='bg-green-300'>Income</Badge>
            </div>
            <div>
              <Badge className='bg-red-300'>Expense</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
