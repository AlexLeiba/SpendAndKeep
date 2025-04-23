import { MAX_DATE_RANGE_DAYS } from '@/lib/consts';
import { Currencies } from '@/lib/currencies';
import { differenceInDays } from 'date-fns';
import { z } from 'zod';

export const UserSettingsSchema = z.object({
  currency: z.custom((currencyValue) => {
    const found = Currencies.find(
      (currencyData) => currencyData.currency === currencyValue
    );
    if (!found) {
      throw new Error(`Invalid currency ${currencyValue}`);
    }

    return currencyValue;
  }),
});

export type UserSettingsSchemaType = z.infer<typeof UserSettingsSchema>;

export const CreateTransactionSchema = z.object({
  description: z.string().optional(),
  amount: z.coerce.number().positive(), //even if we will pass a string to this key it will parse as a number
  category: z.string().min(1, 'Category is required'),
  date: z.coerce.date().optional(),
  type: z.union([z.literal('expense'), z.literal('income')]),
  categoryIcon: z.string().optional(),
});

export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;

export const CreateCategorySchema = z.object({
  name: z.string().min(3, 'Name is required').max(20, 'Name is too long'),
  icon: z.string().min(1, 'Icon is required'),
  type: z.enum(['income', 'expense']),
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;

export const OverviewQuerySchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  page: z.coerce.number().default(1),
});
// .refine((data) => {
//   const { from, to } = data;

//   const isTheSameDate = from.getTime() === to.getTime();

//   // Check difference between from and to
//   const days = differenceInDays(to, from);
//   const isValidDateRange = days > 0 && days <= MAX_DATE_RANGE_DAYS;

//   return isValidDateRange;
// }

export type OverviewQuerySchemaType = z.infer<typeof OverviewQuerySchema>;

export const GetHistoryDataSchema = z.object({
  timeframe: z.enum(['month', 'year']),
  month: z.coerce
    .number()
    .min(0, 'Month is too low')
    .max(11, 'Month is too high')
    .default(0),
  year: z.coerce
    .number()
    .min(1900, 'Year is too low')
    .max(3000, 'Year is too high')
    .default(new Date().getFullYear()),
});

export type GetHistoryDataSchemaType = z.infer<typeof GetHistoryDataSchema>;
