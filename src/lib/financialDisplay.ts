/**
 * Financial display helpers
 * - No compact/abbreviated formatting (no k/M)
 * - Always returns full figures with decimals for corporate-style readability
 */

export type DualCurrencyDisplay = {
  local: string;
  mobi: string;
  combined: string;
};

export function formatNumberFull(
  amount: number,
  fractionDigits: number = 2,
  locale?: string,
): string {
  return amount.toLocaleString(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/**
 * Local-first dual currency display for NGN (₦) and Mobi (M).
 * Note: In this UI template NGN:Mobi is treated as 1:1 for display.
 * PRIMARY: Local Currency (₦), SECONDARY: Mobi (M)
 */
export function formatNgnMobi(amount: number, fractionDigits: number = 2): DualCurrencyDisplay {
  const abs = Math.abs(amount);
  const formatted = formatNumberFull(abs, fractionDigits);
  const local = `₦${formatted}`;
  const mobi = `M${formatted}`;
  return { local, mobi, combined: `${local} (${mobi})` };
}
