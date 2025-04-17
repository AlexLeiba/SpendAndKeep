import React from 'react';
import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

export function CustomChartTooltip({
  data,
}: {
  data: TooltipProps<ValueType, NameType>;
}) {
  return <div>CustomChartTooltip</div>;
}
