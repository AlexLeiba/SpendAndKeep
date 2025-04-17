'use client';
import React from 'react';
import { PeriodType, TimeframeType } from '@/lib/types';
import { UserSettings } from '@prisma/client';
import { GetFormatterForCurrency } from '@/lib/helpers';
import { Spacer } from '@/components/ui/spacer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HistoryPeriodSelector } from './HistoryPeriodSelector';
import { useQuery } from '@tanstack/react-query';
import { SkeletonWrapper } from '@/components/Skeletons/SkeletonWrapper';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CustomChartTooltip } from './CustomChartTooltip';

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

  const { isPending: isPendingHistoryData, data: historyData } = useQuery({
    queryKey: ['overview', 'history', timeframe, period],
    queryFn: async () => {
      const response = await fetch(
        `/api/history/history-data?timeframe=${timeframe}&month=${period.month}&year=${period.year}`
      );
      return response.json();
    },
  });
  console.log('🚀 ~ historyData:=>>>>>>>>>>>>>>', historyData);

  return (
    <div>
      <h2 className='text-3xl font-bold'>History</h2>
      <Spacer size={6} />

      <Card className='rounded-md'>
        <CardHeader className='flex justify-between items-center'>
          <div>
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />
          </div>

          <div className='flex gap-4'>
            <div className='flex gap-2 items-center'>
              <div className='w-4 h-4 bg-green-300 rounded-full'></div>

              <p>Income</p>
            </div>
            <div className='flex gap-2 items-center'>
              <div className='w-4 h-4 bg-red-300 rounded-full'></div>
              <p>Expense</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={isPendingHistoryData}>
            {historyData && historyData.length > 0 ? (
              <ResponsiveContainer width='100%' height={300}>
                <BarChart height={300} data={historyData} barCategoryGap={2}>
                  {/* <defs></defs> */}
                  <CartesianGrid
                    strokeDasharray={'5 5'}
                    strokeOpacity={'0.5'}
                  />
                  <XAxis
                    stroke='#888888'
                    fontSize={16}
                    tickLine={false}
                    axisLine={false}
                    dataKey={(data) => {
                      const { day, month, year } = data;
                      const date = new Date(year, month, day + 1);

                      if (timeframe === 'year') {
                        return date.toLocaleDateString('en-US', {
                          month: 'short', //name of month
                        });
                      }
                      return date.toLocaleDateString('en-US', {
                        day: 'numeric', //number of day
                      });
                    }}
                  />
                  <YAxis
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ opacity: 1 }}
                    content={(data) => <CustomChartTooltip data={data} />}
                  />

                  <Bar
                    label='Expense'
                    radius={4}
                    dataKey='expense'
                    fill='#a92e3c'
                    activeBar={<Rectangle fill='pink' stroke='blue' />}
                  />
                  <Bar
                    label='Income'
                    radius={4}
                    dataKey='income'
                    fill='#52bc7a'
                    activeBar={<Rectangle fill='gold' stroke='purple' />}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className='h-[300px]'>
                <Spacer size={6} />
                <p className='text-center text-muted-foreground'>
                  No data available for this period.
                </p>
                <p className='text-center text-muted-foreground'>
                  Please select another period.
                </p>
              </div>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
