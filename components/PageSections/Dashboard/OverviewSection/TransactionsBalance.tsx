import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route';
import { GetCategoriesStatsType } from '@/app/api/stats/categories/route';
import { SkeletonWrapper } from '@/components/Skeletons/SkeletonWrapper';
import { Spacer } from '@/components/ui/spacer';
import { Currencies } from '@/lib/currencies';
import { GetFormatterForCurrency } from '@/lib/helpers';
import { useQuery } from '@tanstack/react-query';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React from 'react';
import CountUp from 'react-countup';
import { toast } from 'sonner';

export function TransactionsBalance({
  currency,
  from,
  to,
}: {
  currency: string;
  from: Date;
  to: Date;
}) {
  const { data: statsQueryData, isPending: isPendingBalance } =
    // GET BALANCE
    useQuery<GetBalanceStatsResponseType>({
      queryKey: ['overview', 'stats', 'balance', from, to], //every time we receive (form,to new values) the data will be refetched
      queryFn: async () => {
        const response = await fetch(
          `/api/stats/balance?from=${from}&to=${to}`
        );

        if (response.status !== 200) {
          return toast.error(
            response.statusText
              ? response.statusText
              : 'Something went wrong, please try again',
            {
              id: 'overview',
            }
          );
        }

        return response.json();
      },
    });

  // GET CATEGORIES INCOME/EXPENSE
  const { data: categoriesQueryData, isPending: isPendingCategories } =
    useQuery<GetCategoriesStatsType>({
      queryKey: ['overview', 'stats', 'categories', from, to], //every time we receive (form,to new values) the data will be refetched
      queryFn: async () => {
        const response = await fetch(
          `/api/stats/categories?from=${from}&to=${to}`
        );
        if (response.status !== 200) {
          return toast.error(
            response.statusText
              ? response.statusText
              : 'Something went wrong, please try again',
            {
              id: 'overview',
            }
          );
        }

        return response.json();
      },
    });

  //used useMemo to avoid recalculation at each Render
  const formatter = React.useMemo(() => {
    return GetFormatterForCurrency(currency);
  }, [currency]);

  const formatFn = React.useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  // INCOME DATA
  const incomeQueryData = statsQueryData?.income || 0;

  // EXPENSE DATA
  const expenseQueryData = statsQueryData?.expense || 0;

  // BALANCE DATA
  const balanceData = incomeQueryData - expenseQueryData;

  const overviewStatsData = [
    {
      title: 'Income',
      value: incomeQueryData,

      type: 'income',
    },
    {
      title: 'Expense',
      value: expenseQueryData,
      type: 'expense',
    },
    {
      title: 'Balance',
      value: balanceData,
      type: 'balance',
    },
  ];

  const budget = 10000;
  return (
    <>
      <div className='grid gap-4'>
        <div className='grid grid-cols-3  gap-2 '>
          {overviewStatsData.map((item, index) => {
            //3 STATS CARDS
            return (
              <div key={index}>
                <div className='flex  gap-2 dark:bg-gray-950 rounded-sm p-6 w-full h-full border-1 lg:flex-row md:flex-row flex-col '>
                  <div>
                    {item.type === 'income' && (
                      <div className='w-10 h-full rounded-sm dark:bg-green-900 bg-green-300 flex items-center justify-center text-white'>
                        <TrendingUp />
                      </div>
                    )}
                    {item.type === 'expense' && (
                      <div className='w-10 h-full rounded-sm dark:bg-red-900 bg-red-300 flex items-center justify-center text-white'>
                        <TrendingDown />
                      </div>
                    )}
                    {item.type === 'balance' && (
                      <div className='w-10 h-full rounded-sm dark:bg-purple-900 bg-purple-300 flex items-center justify-center text-white'>
                        <Wallet />
                      </div>
                    )}
                  </div>

                  <div className='grid grid-cols-1 '>
                    <span className='font-bold'>{item.title}</span>

                    <SkeletonWrapper isLoading={isPendingBalance} fullWidth>
                      <span className='text-md '>
                        <CountUp
                          preserveValue
                          redraw={false}
                          end={item.value}
                          decimals={2}
                          formattingFn={formatFn}
                        />
                      </span>
                    </SkeletonWrapper>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className='grid lg:grid-cols-2 md:grid-cols-2 gap-x-2 lg:gap-y-0 md:gap-y-0 gap-y-4 '>
          {/* BY CATEGORY */}
          <div className='grid   gap-x-2 '>
            {/*INCOME CARD */}
            <div className='dark:bg-gray-950 p-6 rounded-sm border-1'>
              <h3 className='text-1xl font-bold'>Income by category</h3>
              <Spacer size={6} />
              <SkeletonWrapper isLoading={isPendingCategories} fullWidth>
                {!isPendingCategories &&
                categoriesQueryData &&
                categoriesQueryData.length > 0 &&
                categoriesQueryData?.filter((data) => data.type === 'income')
                  .length > 0 ? (
                  categoriesQueryData
                    ?.filter((data) => data.type === 'income')
                    .map((item, index) => {
                      return (
                        <div
                          key={index}
                          className='flex h-[50px] gap-2 flex-col overflow-hidden'
                        >
                          <div className='flex justify-between w-full '>
                            <div className='flex gap-2 items-center'>
                              {item.categoryIcon}
                              <p className='text-sm'>{item.category}</p>
                              {item._sum?.amount && (
                                <>
                                  <p className='text-xs text-gray-400'>
                                    {Math.ceil(
                                      (item._sum?.amount / balanceData) * 100
                                    )}
                                    % (of total balance)
                                  </p>
                                </>
                              )}
                            </div>
                            <div className='flex gap-1 items-center'>
                              {
                                Currencies.find(
                                  (data) => data.currency === currency
                                )?.symbol
                              }
                              <p>{item._sum.amount}</p>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className='w-full h-1 dark:bg-gray-950 rounded-sm border-1'>
                            {item._sum?.amount && (
                              <div
                                className='dark:bg-green-900 bg-green-500 h-full rounded-sm'
                                style={{
                                  width: `${Math.ceil(
                                    (item._sum?.amount / incomeQueryData) * 100
                                  )}%`,
                                }}
                              ></div>
                            )}
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className='text-sm dark:text-gray-300'>
                    No income found for this period.
                  </p>
                )}
              </SkeletonWrapper>
            </div>
          </div>
          {/* <Spacer size={6} /> */}
          {/* BY EXPENSE */}
          <div className='grid  gap-x-2 '>
            {/*EXPENSE CARD */}
            <div className='dark:bg-gray-950 p-6 rounded-sm border-1'>
              <h3 className='text-1xl font-bold'>Expense by category</h3>
              <Spacer size={6} />
              <SkeletonWrapper isLoading={isPendingCategories} fullWidth>
                {!isPendingCategories &&
                categoriesQueryData &&
                categoriesQueryData.length > 0 &&
                categoriesQueryData?.filter((data) => data.type === 'expense')
                  .length > 0 ? (
                  categoriesQueryData
                    ?.filter((data) => data.type === 'expense')
                    .map((item, index) => {
                      return (
                        <div
                          key={index}
                          className='flex h-[50px] gap-2 flex-col overflow-hidden'
                        >
                          <div className='flex justify-between w-full '>
                            <div className='flex gap-2 items-center'>
                              {item.categoryIcon}
                              <p className='text-sm'>{item.category}</p>
                              {item._sum?.amount && (
                                <>
                                  <p className='text-xs text-gray-400'>
                                    {Math.ceil(
                                      (item._sum?.amount / budget) * 100
                                    )}
                                    % (of total income)
                                  </p>
                                </>
                              )}
                            </div>
                            <div className='flex gap-1 items-center'>
                              {
                                Currencies.find(
                                  (data) => data.currency === currency
                                )?.symbol
                              }
                              <p>{item._sum.amount}</p>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className='w-full h-1 dark:bg-gray-950 border-1 rounded-sm'>
                            {item._sum?.amount && (
                              <div
                                className='dark:bg-red-900 bg-red-500 h-full rounded-sm'
                                style={{
                                  width: `${Math.ceil(
                                    (item._sum?.amount / budget) * 100
                                  )}%`,
                                }}
                              ></div>
                            )}
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className='text-sm dark:text-gray-300'>
                    No expense found for this period.
                  </p>
                )}
              </SkeletonWrapper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
