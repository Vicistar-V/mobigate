// Mobigate Universal Currency Translation Utilities

import { 
  SUPPORTED_CURRENCIES, 
  ExchangeRate, 
  ConversionResult, 
  ProfitCalculation,
  PlatformFeeType
} from "@/types/mobiFinancialProtocol";

/**
 * Get exchange rate for a specific currency
 */
export function getExchangeRate(currencyCode: string): ExchangeRate | undefined {
  return SUPPORTED_CURRENCIES.find(c => c.currencyCode === currencyCode);
}

/**
 * Get the default currency (NGN)
 */
export function getDefaultCurrency(): ExchangeRate {
  return SUPPORTED_CURRENCIES.find(c => c.isDefault) || SUPPORTED_CURRENCIES[0];
}

/**
 * Convert local currency amount to Mobi
 */
export function convertToMobi(amount: number, currencyCode: string): ConversionResult {
  const rate = getExchangeRate(currencyCode);
  if (!rate) {
    throw new Error(`Unsupported currency: ${currencyCode}`);
  }
  
  const mobiAmount = amount * rate.rateToMobi;
  
  return {
    fromAmount: amount,
    fromCurrency: currencyCode,
    toAmount: mobiAmount,
    toCurrency: "MOBI",
    exchangeRate: rate.rateToMobi,
  };
}

/**
 * Convert Mobi to local currency
 */
export function convertFromMobi(mobiAmount: number, currencyCode: string): ConversionResult {
  const rate = getExchangeRate(currencyCode);
  if (!rate) {
    throw new Error(`Unsupported currency: ${currencyCode}`);
  }
  
  const localAmount = mobiAmount * rate.rateFromMobi;
  
  return {
    fromAmount: mobiAmount,
    fromCurrency: "MOBI",
    toAmount: localAmount,
    toCurrency: currencyCode,
    exchangeRate: rate.rateFromMobi,
  };
}

/**
 * Format Mobi amount with symbol
 */
export function formatMobiAmount(amount: number): string {
  return `M${amount.toLocaleString()}`;
}

/**
 * Format local currency amount with symbol
 */
export function formatLocalAmount(amount: number, currencyCode: string): string {
  const rate = getExchangeRate(currencyCode);
  if (!rate) {
    return `${amount.toLocaleString()} ${currencyCode}`;
  }
  
  // Format based on currency
  if (currencyCode === "NGN") {
    return `₦${amount.toLocaleString()}`;
  }
  
  return `${rate.currencySymbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format both Mobi and local equivalent for display
 */
export function formatMobiWithLocal(
  mobiAmount: number, 
  localCurrency: string = "NGN"
): { mobi: string; local: string; combined: string } {
  const localAmount = convertFromMobi(mobiAmount, localCurrency);
  
  return {
    mobi: formatMobiAmount(mobiAmount),
    local: formatLocalAmount(localAmount.toAmount, localCurrency),
    combined: `${formatMobiAmount(mobiAmount)} (≈ ${formatLocalAmount(localAmount.toAmount, localCurrency)})`,
  };
}

/**
 * Calculate platform profit from exchange rate margins
 * Mobigate profits from the spread between buy/sell rates
 */
export function calculatePlatformProfit(
  transactionAmount: number,
  sourceCurrency: string,
  communitySharePercent: number = 60
): ProfitCalculation {
  // Base margin on exchange rate differential (simulated 2% margin)
  const exchangeMarginPercent = 0.02;
  const exchangeMargin = transactionAmount * exchangeMarginPercent;
  
  // Platform processing fee (simulated 1%)
  const platformFeePercent = 0.01;
  const platformFee = transactionAmount * platformFeePercent;
  
  const grossProfit = exchangeMargin + platformFee;
  
  // Split between community and Mobigate
  const communityShare = grossProfit * (communitySharePercent / 100);
  const mobigateShare = grossProfit * ((100 - communitySharePercent) / 100);
  
  return {
    grossAmount: transactionAmount,
    exchangeMargin,
    platformFee,
    communityShare,
    mobigateShare,
    netProfit: mobigateShare,
  };
}

/**
 * Get fee description for different fee types
 */
export function getFeeTypeDescription(feeType: PlatformFeeType): string {
  const descriptions: Record<PlatformFeeType, string> = {
    nomination_fee: "Nomination Declaration Fee",
    campaign_fee: "Campaign Advertising Fee",
    service_fee: "Platform Service Fee",
    processing_fee: "Transaction Processing Fee",
    platform_premium: "Premium Feature Access",
    accreditation_fee: "Voter Accreditation Fee",
  };
  
  return descriptions[feeType] || "Platform Fee";
}

/**
 * Validate wallet balance for a transaction
 */
export function validateWalletBalance(
  walletBalance: number, 
  requiredAmount: number
): { 
  isValid: boolean; 
  shortfall: number; 
  message: string;
} {
  const shortfall = requiredAmount - walletBalance;
  
  if (walletBalance >= requiredAmount) {
    return {
      isValid: true,
      shortfall: 0,
      message: "Sufficient balance",
    };
  }
  
  return {
    isValid: false,
    shortfall,
    message: `Insufficient balance. You need ${formatMobiAmount(shortfall)} more.`,
  };
}

/**
 * Generate transaction reference
 */
export function generateTransactionReference(prefix: string = "TXN"): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Get all supported currencies for dropdown
 */
export function getSupportedCurrencies(): Array<{
  value: string;
  label: string;
  symbol: string;
  flag: string;
}> {
  return SUPPORTED_CURRENCIES.map(c => ({
    value: c.currencyCode,
    label: `${c.currencyName} (${c.currencySymbol})`,
    symbol: c.currencySymbol,
    flag: c.countryFlag,
  }));
}
