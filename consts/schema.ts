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
