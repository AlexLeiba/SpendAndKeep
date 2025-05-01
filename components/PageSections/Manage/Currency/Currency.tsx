import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CurrencyComboBox } from '../../Dashboard/HelloTopSection/CurrencyComboBox';

export function Currency() {
  return (
    <div>
      <Card className='w-full text-left rounded-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>Currency</CardTitle>

          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* CURRENCY SELECT (DROPDOWN) */}
          <CurrencyComboBox />
        </CardContent>
      </Card>
    </div>
  );
}
