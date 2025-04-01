export const Currencies = [
  {
    id: 'RON',
    name: 'Romanian Leu',
    symbol: 'lei',
    locale: 'ro-RO',
  },
  {
    id: 'USD',
    name: 'US Dollar',
    symbol: '$',
    locale: 'en-US',
  },
  {
    id: 'EUR',
    name: 'Euro',
    symbol: '€',
    locale: 'en-US',
  },
  {
    id: 'GBP',
    name: 'Pound Sterling',
    symbol: '£',
    locale: 'en-GB',
  },
  {
    id: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    locale: 'ja-JP',
  },
  {
    id: 'AUD',
    name: 'Australian Dollar',
    symbol: '$',
    locale: 'en-AU',
  },
  {
    id: 'CAD',
    name: 'Canadian Dollar',
    symbol: '$',
    locale: 'en-CA',
  },
];

export type CurrencyType = (typeof Currencies)[0];
