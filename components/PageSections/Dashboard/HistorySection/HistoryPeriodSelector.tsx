import { HistoryPeriodType } from '@/app/api/history/history-periods/route';
import { SkeletonWrapper } from '@/components/Skeletons/SkeletonWrapper';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PeriodType, TimeframeType } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { YearSelector } from './YearSelector';
import { MonthSelector } from './MonthSelector';

type Props = {
  period: PeriodType;
  setPeriod: React.Dispatch<React.SetStateAction<PeriodType>>;
  timeframe: TimeframeType;
  setTimeframe: React.Dispatch<React.SetStateAction<TimeframeType>>;
};
export function HistoryPeriodSelector({
  period,
  setPeriod,
  timeframe,
  setTimeframe,
}: Props) {
  const { isPending: isPendinghistoryByYearData, data: historyByYearData } =
    useQuery<HistoryPeriodType>({
      queryKey: ['overview', 'history', 'periods'],
      queryFn: async () => {
        const response = await fetch('/api/history/history-periods');
        return response.json();
      },
    });
  console.log('🚀 ~ historyPeriods:', historyByYearData);

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <SkeletonWrapper isLoading={isPendinghistoryByYearData} fullWidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as TimeframeType)}
        >
          <TabsList>
            <TabsTrigger value='year'>Year</TabsTrigger>
            <TabsTrigger value='month'>Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>

      <div>
        <SkeletonWrapper
          isLoading={isPendinghistoryByYearData}
          fullWidth={false}
        >
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyByYearData}
          />
        </SkeletonWrapper>
      </div>

      {timeframe === 'month' && (
        <div>
          <SkeletonWrapper
            isLoading={isPendinghistoryByYearData}
            fullWidth={false}
          >
            <MonthSelector
              period={period}
              setPeriod={setPeriod}
              years={historyByYearData}
            />
          </SkeletonWrapper>
        </div>
      )}
    </div>
  );
}
