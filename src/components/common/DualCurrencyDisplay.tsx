import { formatMobiAmount, formatLocalAmount, convertFromMobi } from "@/lib/mobiCurrencyTranslation";

interface DualCurrencyDisplayProps {
  mobiAmount: number;
  localCurrency?: string;
  showSign?: "+" | "-" | "auto" | "none";
  transactionType?: "income" | "expense" | "transfer" | "credit" | "debit";
  size?: "sm" | "md" | "lg";
  colorize?: boolean;
  showLocalInline?: boolean;
  className?: string;
}

/**
 * DualCurrencyDisplay - Displays Mobi amount with local currency equivalent
 * 
 * For NGN (1:1 rate), shows: M15,000 (₦15,000)
 * For other currencies, shows: M50,000 (≈ $100)
 */
export function DualCurrencyDisplay({
  mobiAmount,
  localCurrency = "NGN",
  showSign = "none",
  transactionType,
  size = "md",
  colorize = true,
  showLocalInline = true,
  className = "",
}: DualCurrencyDisplayProps) {
  // Determine sign based on transaction type or explicit sign
  let sign = "";
  if (showSign === "auto" && transactionType) {
    if (transactionType === "income" || transactionType === "credit") {
      sign = "+";
    } else if (transactionType === "expense" || transactionType === "debit") {
      sign = "-";
    }
  } else if (showSign === "+") {
    sign = "+";
  } else if (showSign === "-") {
    sign = "-";
  }

  // Determine color based on transaction type
  let colorClass = "";
  if (colorize && transactionType) {
    if (transactionType === "income" || transactionType === "credit") {
      colorClass = "text-green-600";
    } else if (transactionType === "expense" || transactionType === "debit") {
      colorClass = "text-red-600";
    } else if (transactionType === "transfer") {
      colorClass = "text-blue-600";
    }
  }

  // Get local currency equivalent
  const localAmount = convertFromMobi(Math.abs(mobiAmount), localCurrency);
  const localFormatted = formatLocalAmount(localAmount.toAmount, localCurrency);

  // Size classes
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const mobiFormatted = `${sign}M${Math.abs(mobiAmount).toLocaleString()}`;

  return (
    <span className={`font-semibold ${sizeClasses[size]} ${colorClass} ${className}`}>
      {mobiFormatted}
      {showLocalInline && (
        <span className="text-muted-foreground font-normal text-xs ml-1">
          ({localFormatted})
        </span>
      )}
    </span>
  );
}

/**
 * Formats a Mobi amount with local currency for simple text display
 */
export function formatDualCurrency(
  mobiAmount: number,
  localCurrency: string = "NGN",
  options?: {
    showSign?: "+" | "-" | "none";
    approximateSymbol?: boolean;
  }
): string {
  const { showSign = "none", approximateSymbol = true } = options || {};
  
  const sign = showSign === "+" ? "+" : showSign === "-" ? "-" : "";
  const amount = Math.abs(mobiAmount);
  
  const localAmount = convertFromMobi(amount, localCurrency);
  const localFormatted = formatLocalAmount(localAmount.toAmount, localCurrency);
  
  const mobi = `${sign}M${amount.toLocaleString()}`;
  const approx = approximateSymbol && localCurrency !== "NGN" ? "≈ " : "";
  
  return `${mobi} (${approx}${localFormatted})`;
}

/**
 * Hook-style helper for formatting amounts with currency context
 */
export function useDualCurrency(localCurrency: string = "NGN") {
  return {
    format: (mobiAmount: number, sign?: "+" | "-" | "none") =>
      formatDualCurrency(mobiAmount, localCurrency, { showSign: sign }),
    formatMobi: (mobiAmount: number) => formatMobiAmount(mobiAmount),
    formatLocal: (mobiAmount: number) => {
      const localAmount = convertFromMobi(mobiAmount, localCurrency);
      return formatLocalAmount(localAmount.toAmount, localCurrency);
    },
  };
}
