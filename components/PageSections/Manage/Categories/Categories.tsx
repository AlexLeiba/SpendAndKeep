'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React from 'react';
import { CreateCategoryDialog } from '../../Dashboard/HelloTopSection/CreateCategoryDialog';
import { Space, TrendingDown, TrendingUp } from 'lucide-react';
import { Spacer } from '@/components/ui/spacer';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkeletonWrapper } from '@/components/Skeletons/SkeletonWrapper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Category } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { RemoveCategoryAction } from '@/app/server-actions/manage-actions';
import { toast } from 'sonner';

export function Categories() {
  const queryClient = useQueryClient();
  const [categoryType, setCategoryType] = React.useState<'Income' | 'Expense'>(
    'Expense'
  );
  const {
    data: categoriesQueryData,
    isPending: isPendingCategories,
    refetch: refetchCategoriesList,
  } = useQuery<Category[]>({
    queryKey: ['overview', 'categoryList', categoryType], // if we put query param here after key, IF the parameter will change the query gets refetched auto.
    queryFn: async () => {
      const response = await fetch(
        `/api/categories?category=${categoryType.toLowerCase()}`
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

  const { mutate: removeCategory, isPending: isPendingRemoveCategory } =
    useMutation({
      mutationFn: RemoveCategoryAction,
      onSuccess: () => {
        toast.success('Category removed successfully 🎉', {
          id: 'remove-category',
        });

        queryClient.invalidateQueries({
          queryKey: ['overview', 'categoryList'],
        }); // refetch transactions overview on Dashboard page
      },
      onError: () => {
        toast.error('Something went wrong 🥺, please try again', {
          id: 'remove-category',
        });
      },
    });
  return (
    <div>
      <Card className='rounded-md'>
        <CardHeader className='flex justify-between '>
          {/* CREATE NEW CATEGORY DIALOG (MODAL) INCOME */}
          <div className='flex justify-between flex-col gap-2'>
            <div className='flex gap-2 items-center'>
              <div className='w-10 h-10 rounded-sm dark:bg-green-900 bg-green-300 flex items-center justify-center text-white'>
                <TrendingUp />
              </div>
              <div>
                <h4 className='text-2xl'>Add Income categories</h4>
                <p className='text-sm text-gray-400'>
                  Add new categories to track your income
                </p>
              </div>
            </div>
            <CreateCategoryDialog
              type={'income'}
              refetchCategoriesList={refetchCategoriesList}
            />
          </div>

          <Spacer lg={12} md={6} sm={6} />

          {/* CREATE NEW CATEGORY DIALOG (MODAL) EXPENSE*/}
          <div className='flex justify-between flex-col gap-2'>
            <div className='flex gap-2 items-center'>
              <div className='w-10 h-10 rounded-sm dark:bg-red-900 bg-red-300 flex items-center justify-center text-white'>
                <TrendingDown />
              </div>
              <div>
                <h4 className='text-2xl'>Add Expense categories</h4>
                <p className='text-sm text-gray-400'>
                  Add new categories to track your expense
                </p>
              </div>
            </div>
            <CreateCategoryDialog
              type={'expense'}
              refetchCategoriesList={refetchCategoriesList}
            />
          </div>
        </CardHeader>
      </Card>

      {/* CATEGORIES  LIST */}
      <Spacer lg={12} md={6} sm={6} />
      <h4 className='text-2xl'>{categoryType} categories list</h4>
      <p className='text-sm text-gray-400'>
        Manage your {categoryType} categories list
      </p>
      <Spacer size={3} />
      <Tabs
        defaultValue='expense'
        value={categoryType}
        onValueChange={(value) =>
          setCategoryType(value as 'Income' | 'Expense')
        }
      >
        <TabsList>
          <TabsTrigger value='Expense'>Expense</TabsTrigger>
          <TabsTrigger value='Income'>Income</TabsTrigger>
        </TabsList>
      </Tabs>
      <Spacer size={3} />

      <Card className='rounded-md'>
        <SkeletonWrapper isLoading={isPendingCategories} fullWidth={false}>
          <CardContent>
            {categoriesQueryData && categoriesQueryData.length > 0 ? (
              categoriesQueryData.map((item, index) => {
                return (
                  <div
                    key={index}
                    className='flex h-[60px] items-center  flex-col overflow-hidden '
                  >
                    <div className='flex justify-between w-full border-b pb-2 '>
                      <div className='flex gap-2 items-center'>
                        <p className='text-4xl'>{item.icon}</p>
                        <p className='text-sm'>{item.name}</p>
                      </div>

                      <Button
                        disabled={isPendingRemoveCategory}
                        onClick={() => {
                          toast.loading('Removing category...', {
                            id: 'remove-category',
                          });
                          removeCategory({
                            categoryId: item.id,
                            categoryType: categoryType.toLowerCase() as
                              | 'expense'
                              | 'income',
                          });
                        }}
                        variant={'outline'}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className='text-sm text-gray-300'>
                No {categoryType} categories found .
              </p>
            )}
          </CardContent>
        </SkeletonWrapper>
      </Card>
    </div>
  );
}
