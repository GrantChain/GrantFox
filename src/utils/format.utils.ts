import type { Decimal } from "@prisma/client/runtime/library";

export const formatCurrency = (currency: string, amount: Decimal) => {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));

  return `${currency} ${formattedAmount}`;
};
