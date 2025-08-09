import type { Decimal } from "@prisma/client/runtime/library";

export const formatCurrency = (currency?: string, amount?: Decimal) => {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

  return currency ? `${currency} ${formattedAmount}` : formattedAmount;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};
