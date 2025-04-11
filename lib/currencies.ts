export const Currencies = [
  {
    currency: 'RON',
    name: 'Romanian Leu',
    symbol: 'lei',
    locale: 'ro-RO',
  },
  {
    currency: 'USD',
    name: 'US Dollar',
    symbol: '$',
    locale: 'en-US',
  },
  {
    currency: 'EUR',
    name: 'Euro',
    symbol: '€',
    locale: 'en-US',
  },
  {
    currency: 'GBP',
    name: 'Pound Sterling',
    symbol: '£',
    locale: 'en-GB',
  },
  {
    currency: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    locale: 'ja-JP',
  },
  {
    currency: 'AUD',
    name: 'Australian Dollar',
    symbol: '$',
    locale: 'en-AU',
  },
  {
    currency: 'CAD',
    name: 'Canadian Dollar',
    symbol: '$',
    locale: 'en-CA',
  },
];

export type CurrencyType = (typeof Currencies)[0];
