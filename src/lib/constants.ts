export const CURRENCY = {
  code: 'INR',
  symbol: '₹',
  locale: 'en-IN',
};

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: 2,
  }).format(amount);

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString(CURRENCY.locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const formatDateTime = (date: string): string =>
  new Date(date).toLocaleDateString(CURRENCY.locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
