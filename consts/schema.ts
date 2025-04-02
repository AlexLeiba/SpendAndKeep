import { Currencies } from '@/lib/currencies';
import { z } from 'zod';

export const UserSettingsSchema = z.object({
  currency: z.custom((value) => {
    const found = Currencies.find((currency) => currency.id === value);
    if (!found) {
      throw new Error(`Invalid currency ${value}`);
    }

    return value;
  }),
});

export type UserSettingsSchemaType = z.infer<typeof UserSettingsSchema>;

export const CreateTransactionSchema = z.object({
  amount: z.coerce.number().positive(),
  description: z.string().optional(),
  date: z.coerce.date(),
  category: z.string(),
  type: z.union([z.literal('expense'), z.literal('income')]),
});

export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;
