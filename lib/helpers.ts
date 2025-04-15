import { Currencies } from './currencies';

export function GetFormatterForCurrency(currency: string) {
  //Returns a formatted Sum with decimals and currency symbol
  const localeCurrencySymbol = Currencies.find(
    (data) => data.currency === currency
  )?.locale;

  return new Intl.NumberFormat(localeCurrencySymbol, {
    style: 'currency',
    currency: currency,
  });
}
