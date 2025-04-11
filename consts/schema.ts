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
  category: z.string(),
  date: z.coerce.date(),
  type: z.union([z.literal('expense'), z.literal('income')]),
});

export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;

export const CreateCategorySchema = z.object({
  name: z.string().min(3).max(20),
  icon: z.string().min(3).max(20),
  type: z.enum(['income', 'expense']),
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;
