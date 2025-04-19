import { TransactionHistoryType } from '@/app/api/history/history-transactions/route';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export type TransactionHistoryRow = TransactionHistoryType[0]; //transformed type Array in OBJECT

export const tableColumns: ColumnDef<TransactionHistoryRow>[] = [
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
          {format(row.original.createdAt, 'PPP')}
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
            row.original.type === 'income' ? 'bg-green-800' : 'bg-red-800',
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
          <Button variant={'ghost'}>...</Button>
        </div>
      );
    },
  },
];
