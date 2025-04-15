import { Spacer } from '@/components/ui/spacer';
import { Currencies } from '@/lib/currencies';
import { useQuery } from '@tanstack/react-query';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React from 'react';

export function TransactionsBalance({ currency }: { currency: string }) {
  const { data, isPending } = useQuery({
    queryKey: ['transaction-balance'],
    queryFn: async () => {
      const response = await fetch('/api/stats/balance');
      return response.json();
    },
  });
  console.log('🚀 ~ TransactionsBalance ~ data:', data);

  return (
    <div className='grid grid-cols-3 gap-2'>
      {overviewBalance.map((item, index) => {
        return (
          <div key={index}>
            <div className='flex  gap-2 bg-gray-950 rounded-sm p-6 w-full h-full'>
              {item.type === 'income' && (
                <div className='w-10 h-full rounded-sm bg-green-900 flex items-center justify-center'>
                  <TrendingUp />
                </div>
              )}
              {item.type === 'expense' && (
                <div className='w-10 h-full rounded-sm bg-red-900 flex items-center justify-center'>
                  <TrendingDown />
                </div>
              )}
              {item.type === 'balance' && (
                <div className='w-10 h-full rounded-sm bg-purple-900 flex items-center justify-center'>
                  <Wallet />
                </div>
              )}

              <div className='grid grid-cols-1 '>
                <span className='font-bold'>{item.title}</span>
                <span className='text-md '>
                  {
                    Currencies.find((data) => data.currency === currency)
                      ?.symbol
                  }
                  {item.value}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* BY CATEGORY */}
      <div className='grid col-span-4 '>
        <div className='grid col-span-2 gap-x-2 '>
          {/* CARD */}
          <div className='bg-gray-950 p-6 rounded-sm'>
            <h3 className='text-2xl font-bold'>Income by category</h3>
            <Spacer size={6} />

            {incomeData.map((item, index) => {
              return (
                <div key={index} className='flex h-[50px] gap-2 flex-col'>
                  <div className='flex justify-between w-full '>
                    <div className='flex gap-2 items-center'>
                      {item.icon}
                      <p className='text-sm'>{item.title}</p>
                      <p className='text-xs'>(60%)</p>
                    </div>
                    <div className='flex gap-1 items-center'>
                      {
                        Currencies.find((data) => data.currency === currency)
                          ?.symbol
                      }
                      <p>{item.amount}</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className='w-full h-1 bg-gray-900 rounded-sm'>
                    <div
                      className='bg-green-900 h-full rounded-sm'
                      style={{ width: `${item.amount / 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BY EXPENSE */}
        <div className='grid col-span-2 gap-x-2 '>
          {expenseData.map((item, index) => {
            return (
              <div key={index}>
                <div className='flex  bg-gray-950   p-6 w-full h-full'>
                  <div className='flex gap-2 items-center'>
                    {item.icon}
                    <p className='text-sm'>{item.title}</p>
                    <p className='text-xs'>(60%)</p>
                  </div>
                  <div className='flex gap-1 items-center'>
                    {
                      Currencies.find((data) => data.currency === currency)
                        ?.symbol
                    }
                    <p>{item.amount}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const overviewBalance = [
  {
    title: 'Income',
    value: 1000,
    icon: '💰',
    type: 'income',
  },
  {
    title: 'Expense',
    value: 1000,
    icon: '💰',
    type: 'expense',
  },
  {
    title: 'Balance',
    value: 1000,
    icon: '💰',
    type: 'balance',
  },
];

const incomeData = [
  {
    title: 'Cat name',
    amount: 1000,
    icon: '💰',
    type: 'income',
  },
  {
    title: 'Cat name2',
    amount: 1000,
    icon: '💰',
    type: 'income',
  },

  {
    title: 'Cat name3',
    amount: 1000,
    icon: '💰',
    type: 'income',
  },
];
const expenseData = [
  {
    title: 'Cat name',
    amount: 1000,
    icon: '💰',
    type: 'expense',
  },
  {
    title: 'Cat name2',
    amount: 1000,
    icon: '💰',
    type: 'expense',
  },

  {
    title: 'Cat name3',
    amount: 1000,
    icon: '💰',
    type: 'expense',
  },
];
