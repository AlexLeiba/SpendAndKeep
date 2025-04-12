import { Currencies } from '@/lib/currencies';
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
