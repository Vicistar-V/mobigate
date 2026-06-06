// Mobiface Universal Financial Protocol Types

/**
 * Exchange rate configuration for converting between local currencies and Mobi
 * Mobi (M) is the universal platform currency
 */
export interface ExchangeRate {
  currencyCode: string;
  currencySymbol: string;
  currencyName: string;
  countryFlag: string;
  rateToMobi: number;    // How many Mobi per 1 unit of this currency
  rateFromMobi: number;  // How many units of this currency per 1 Mobi
  isDefault?: boolean;
}

/**
 * Supported currencies with their exchange rates
 * Base: ₦1 = M1 (Nigerian Naira is the reference currency)
 */
export const SUPPORTED_CURRENCIES: ExchangeRate[] = [
  {
    currencyCode: "NGN",
    currencySymbol: "₦",
    currencyName: "Nigerian Naira",
    countryFlag: "🇳🇬",
    rateToMobi: 1,
    rateFromMobi: 1,
    isDefault: true,
  },
  {
    currencyCode: "USD",
    currencySymbol: "$",
    currencyName: "US Dollar",
    countryFlag: "🇺🇸",
    rateToMobi: 500,      // $1 = M500
    rateFromMobi: 0.002,  // M1 = $0.002
  },
  {
    currencyCode: "GBP",
    currencySymbol: "£",
    currencyName: "British Pound",
    countryFlag: "🇬🇧",
    rateToMobi: 550,      // £1 = M550
    rateFromMobi: 0.00182,
  },
  {
    currencyCode: "CAD",
    currencySymbol: "$",
    currencyName: "Canadian Dollar",
    countryFlag: "🇨🇦",
    rateToMobi: 350,      // CAD$1 = M350
    rateFromMobi: 0.00286,
  },
  {
    currencyCode: "EUR",
    currencySymbol: "€",
    currencyName: "Euro",
    countryFlag: "🇪🇺",
    rateToMobi: 450,      // €1 = M450
    rateFromMobi: 0.00222,
  },
  {
    currencyCode: "ZAR",
    currencySymbol: "R",
    currencyName: "South African Rand",
    countryFlag: "🇿🇦",
    rateToMobi: 25,       // R1 = M25
    rateFromMobi: 0.04,
  },
  {
    currencyCode: "CFA",
    currencySymbol: "CFA",
    currencyName: "CFA Franc",
    countryFlag: "🇸🇳",
    rateToMobi: 0.9,      // CFA1000 = M900 (CFA1 = M0.9)
    rateFromMobi: 1.111,
  },
];

/**
 * Transaction types for platform fees
 */
export type PlatformFeeType = 
  | 'nomination_fee'
  | 'campaign_fee'
  | 'service_fee'
  | 'processing_fee'
  | 'platform_premium'
  | 'accreditation_fee';

/**
 * Mobi transaction record
 */
export interface MobiTransaction {
  id: string;
  amountInMobi: number;
  localCurrencyAmount: number;
  localCurrencyCode: string;
  feeType: PlatformFeeType;
  description: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference: string;
  // For audit trail
  exchangeRateUsed: number;
  platformProfit?: number;
}

/**
 * Wallet balance with multi-currency display
 */
export interface WalletBalance {
  mobiBalance: number;
  localEquivalent: number;
  localCurrencyCode: string;
  lastUpdated: Date;
}

/**
 * Currency conversion result
 */
export interface ConversionResult {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  exchangeRate: number;
  fee?: number;
  netAmount?: number;
}

/**
 * Platform profit calculation from exchange rate margins
 */
export interface ProfitCalculation {
  grossAmount: number;
  exchangeMargin: number;
  platformFee: number;
  communityShare: number;
  mobifaceShare: number;
  netProfit: number;
}

/**
 * User's preferred currency setting
 */
export interface UserCurrencyPreference {
  userId: string;
  preferredCurrency: string;
  autoConvert: boolean;
  showLocalEquivalent: boolean;
}
