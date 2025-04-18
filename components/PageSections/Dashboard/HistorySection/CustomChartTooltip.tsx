import React from 'react';
import { cn } from '@/lib/utils';
import CountUp from 'react-countup';
import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

export function CustomChartTooltip({
  data,
  formatter,
}: {
  data: TooltipProps<ValueType, NameType> | any;
  formatter: Intl.NumberFormat;
}) {
  const chartData = data.payload[0]?.payload;
  const { expense, income } = chartData || { expense: 0, income: 0 };
  return (
    <div className='flex items-center flex-col bg-gray-900/80 rounded-md p-4 gap-2'>
      <TooltipRow
        value={expense}
        formatter={formatter}
        label={'Expense'}
        bgColor={'bg-red-300'}
        textColor={'text-red-500'}
      />
      <TooltipRow
        value={income}
        formatter={formatter}
        label={'Income'}
        bgColor={'bg-green-300'}
        textColor={'text-green-500'}
      />
      <TooltipRow
        value={income - expense}
        formatter={formatter}
        label={'Balance'}
        bgColor={'bg-gray-300'}
        textColor={'text-gray-200'}
      />
    </div>
  );
}

type TooltipRowProps = {
  label: string;
  value: number;
  bgColor?: string;
  textColor?: string;
  formatter?: Intl.NumberFormat;
};

function TooltipRow({
  label,
  value,
  bgColor,
  textColor,
  formatter,
}: TooltipRowProps) {
  const formattingFn = React.useCallback(
    (value: number) => {
      return formatter ? formatter.format(value) : value.toLocaleString();
    },
    [formatter]
  );
  return (
    <div className='flex gap-8 items-center justify-between w-full'>
      <div className='flex items-center justify-between '>
        <div className='flex gap-2 items-center'>
          <div className={`w-4 h-4 rounded-full ${bgColor}`}></div>
          <p className='text-sm font-medium text-gray-200 '>{label}</p>
        </div>
      </div>

      <CountUp
        className={cn(textColor)}
        duration={0.5}
        preserveValue
        decimals={0}
        formattingFn={formattingFn}
        end={value}
      />
    </div>
  );
}
