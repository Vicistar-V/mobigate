import { formatMobiAmount, formatLocalAmount, convertFromMobi } from "@/lib/mobiCurrencyTranslation";

interface DualCurrencyDisplayProps {
  mobiAmount: number;
  localCurrency?: string;
  showSign?: "+" | "-" | "auto" | "none";
  transactionType?: "income" | "expense" | "transfer" | "credit" | "debit";
  size?: "sm" | "md" | "lg";
  colorize?: boolean;
  showMobiInline?: boolean;
  className?: string;
}

/**
 * DualCurrencyDisplay - Displays LOCAL CURRENCY as PRIMARY with Mobi as secondary
 * 
 * Primary: ₦15,000 (large/main)
 * Secondary: (M15,000) - smaller, bracketed
 */
export function DualCurrencyDisplay({
  mobiAmount,
  localCurrency = "NGN",
  showSign = "none",
  transactionType,
  size = "md",
  colorize = true,
  showMobiInline = true,
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

  // Get local currency equivalent (PRIMARY display)
  const localAmount = convertFromMobi(Math.abs(mobiAmount), localCurrency);
  const localFormatted = formatLocalAmount(localAmount.toAmount, localCurrency);

  // Mobi formatting (SECONDARY display)
  const mobiFormatted = `M${Math.abs(mobiAmount).toLocaleString()}`;

  // Size classes
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const mobiSizeClasses = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <span className={`font-semibold ${sizeClasses[size]} ${colorClass} ${className}`}>
      {sign}{localFormatted}
      {showMobiInline && (
        <span className={`text-muted-foreground font-normal ${mobiSizeClasses[size]} ml-1`}>
          ({mobiFormatted})
        </span>
      )}
    </span>
  );
}

/**
 * Formats amount with LOCAL CURRENCY as primary and Mobi as secondary
 * Output: "₦15,000 (M15,000)" or "+₦15,000 (M15,000)"
 */
export function formatDualCurrency(
  mobiAmount: number,
  localCurrency: string = "NGN",
  options?: {
    showSign?: "+" | "-" | "none";
  }
): string {
  const { showSign = "none" } = options || {};
  
  const sign = showSign === "+" ? "+" : showSign === "-" ? "-" : "";
  const amount = Math.abs(mobiAmount);
  
  const localAmount = convertFromMobi(amount, localCurrency);
  const localFormatted = formatLocalAmount(localAmount.toAmount, localCurrency);
  const mobiFormatted = `M${amount.toLocaleString()}`;
  
  return `${sign}${localFormatted} (${mobiFormatted})`;
}

/**
 * Formats with Mobi primary for backward compatibility where needed
 * Output: "M15,000 (₦15,000)"
 */
export function formatMobiPrimary(
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
    // Primary format: Local currency first
    format: (mobiAmount: number, sign?: "+" | "-" | "none") =>
      formatDualCurrency(mobiAmount, localCurrency, { showSign: sign }),
    // Mobi primary format (backward compat)
    formatMobiFirst: (mobiAmount: number, sign?: "+" | "-" | "none") =>
      formatMobiPrimary(mobiAmount, localCurrency, { showSign: sign }),
    formatMobi: (mobiAmount: number) => formatMobiAmount(mobiAmount),
    formatLocal: (mobiAmount: number) => {
      const localAmount = convertFromMobi(mobiAmount, localCurrency);
      return formatLocalAmount(localAmount.toAmount, localCurrency);
    },
  };
}
