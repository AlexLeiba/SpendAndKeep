'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TransactionHistoryType } from '@/app/api/history/history-transactions/route';
import { SkeletonWrapper } from '@/components/Skeletons/SkeletonWrapper';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DeleteTransactions } from '@/app/server-actions/transactions-actions';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
  data: TransactionHistoryType | undefined;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  isPendingDelete: boolean;
};
const emptyData: TransactionHistoryType = [];

export type TransactionHistoryRow = TransactionHistoryType[0]; //transformed type Array in OBJECT

export function TableComponent({
  data,
  setPage,
  page,
  isPendingDelete,
}: Props) {
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(true);
  const queryClient = useQueryClient();
  const {
    data: transactionsHistory,
    isPending: isPendingTransactionsHistory,
    mutate: handleDeleteTransaction,
  } = useMutation({
    mutationKey: ['transactionsHistory'],
    mutationFn: DeleteTransactions,
    onSuccess: () => {
      toast.success('Transaction deleted successfully 🎉', {
        id: 'deleting-transaction',
      });

      // to refetch the transactions query from table
      queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });
    },
    onError: () => {
      toast.error('Something went wrong 🥺, please try again', {
        id: 'deleting-transaction',
      });
    },
  });

  const tableColumns: ColumnDef<TransactionHistoryRow>[] = [
    {
      accessorKey: 'formattedAmount',
      header: 'Amount',
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        return (
          <div className='flex gap-2 items-center'>
            {row.original.categoryIcon}
            <p className='capitalize'>{row.original.category}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created date',
      cell: ({ row }) => {
        return (
          <div className='flex gap-2 items-center'>
            {format(row.original.updatedAt, 'PPP')}
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: 'Transaction date',
      cell: ({ row }) => {
        return (
          <div className='flex gap-2 items-center'>
            {format(row.original.date, 'PPP')}
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        return (
          <div
            className={cn(
              row.original.type === 'income'
                ? 'bg-green-800 text-white'
                : 'bg-red-800 text-white',
              'p-2 rounded-md'
            )}
          >
            <p className='capitalize text-center'>{row.original.type}</p>
          </div>
        );
      },
    },
    {
      accessorKey: '',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className='flex justify-center items-center'>
            {/* DROPDOWN */}
            <Popover>
              <PopoverTrigger asChild>
                <Button disabled={isPendingDelete} variant={'ghost'}>
                  ...
                </Button>
              </PopoverTrigger>

              <PopoverContent className='flex gap-1 flex-col'>
                <p>Delete transaction</p>

                {/* DELETE MODAL */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Delete</Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogTitle asChild className='text-md'>
                      <p>
                        Are you sure you want to delete "
                        {row.original.description}" transaction?
                      </p>
                    </DialogTitle>
                    <Button
                      variant={'destructive'}
                      onClick={() => handleDeleteTransaction(row.original.id)}
                    >
                      Yes
                    </Button>

                    <DialogClose asChild>
                      <Button>Cancel</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data || emptyData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  function handleChangePage(direction: 'next' | 'prev') {
    if (direction === 'next') {
      setPage((prev) => prev + 1);
    } else {
      setPage((prev) => {
        if (prev === 1) {
          return 1;
        }
        return prev - 1;
      });
    }
  }
  return (
    <SkeletonWrapper isLoading={!data}>
      <div className='flex justify-between items-center'>
        <p className='text-xs dark:text-gray-300'>
          Total transactions: {data?.[0]?.allTransactions}
        </p>
        <div className='flex items-center gap-2'>
          <p className='text-xs'>
            Page: {page} /{' '}
            {data?.[0]?.allTransactions &&
              Math.ceil(data?.[0].allTransactions / 10)}
          </p>
          <Button
            disabled={page === 1}
            variant={'ghost'}
            onClick={() => handleChangePage('prev')}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant={'ghost'}
            onClick={() => handleChangePage('next')}
            disabled={
              data?.[0]?.allTransactions
                ? data?.[0]?.allTransactions < 10
                : false
            }
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </SkeletonWrapper>
  );
}
