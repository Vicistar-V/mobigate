import React, { createContext, useContext, ReactNode } from "react";
import { 
  formatMobiAmount, 
  formatLocalAmount, 
  convertFromMobi,
  getExchangeRate,
  SUPPORTED_CURRENCIES
} from "@/lib/mobiCurrencyTranslation";
import { SUPPORTED_CURRENCIES as CURRENCY_DATA } from "@/types/mobiFinancialProtocol";

interface CurrencyContextType {
  /**
   * The community's default local currency code (e.g., "NGN", "USD")
   */
  communityLocalCurrency: string;
  
  /**
   * User's preferred display currency (defaults to community currency)
   */
  userPreferredCurrency: string;
  
  /**
   * Format a Mobi amount with both Mobi and local currency display
   */
  formatWithLocal: (mobiAmount: number) => {
    mobi: string;
    local: string;
    combined: string;
  };
  
  /**
   * Get the local equivalent of a Mobi amount
   */
  getLocalEquivalent: (mobiAmount: number) => number;
  
  /**
   * Get the currency symbol for the community's local currency
   */
  getCurrencySymbol: () => string;
  
  /**
   * Get the currency flag for the community's local currency
   */
  getCurrencyFlag: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
  /**
   * The community's local currency code. Defaults to "NGN"
   */
  communityLocalCurrency?: string;
  /**
   * User's preferred currency for display. Defaults to community currency
   */
  userPreferredCurrency?: string;
}

export function CurrencyProvider({
  children,
  communityLocalCurrency = "NGN",
  userPreferredCurrency,
}: CurrencyProviderProps) {
  const effectiveCurrency = userPreferredCurrency || communityLocalCurrency;
  
  const currencyData = CURRENCY_DATA.find(c => c.currencyCode === effectiveCurrency) 
    || CURRENCY_DATA.find(c => c.isDefault)!;
  
  const formatWithLocal = (mobiAmount: number) => {
    const localConversion = convertFromMobi(mobiAmount, effectiveCurrency);
    const mobi = formatMobiAmount(mobiAmount);
    const local = formatLocalAmount(localConversion.toAmount, effectiveCurrency);
    
    // For NGN (1:1 rate), the values are identical
    if (effectiveCurrency === "NGN") {
      return {
        mobi,
        local,
        combined: mobi, // No need to show equivalent when 1:1
      };
    }
    
    return {
      mobi,
      local,
      combined: `${mobi} (≈ ${local})`,
    };
  };
  
  const getLocalEquivalent = (mobiAmount: number): number => {
    const conversion = convertFromMobi(mobiAmount, effectiveCurrency);
    return conversion.toAmount;
  };
  
  const getCurrencySymbol = (): string => {
    return currencyData.currencySymbol;
  };
  
  const getCurrencyFlag = (): string => {
    return currencyData.countryFlag;
  };
  
  return (
    <CurrencyContext.Provider
      value={{
        communityLocalCurrency,
        userPreferredCurrency: effectiveCurrency,
        formatWithLocal,
        getLocalEquivalent,
        getCurrencySymbol,
        getCurrencyFlag,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    // Return default values when used outside provider
    // This allows components to work without wrapping in provider
    return {
      communityLocalCurrency: "NGN",
      userPreferredCurrency: "NGN",
      formatWithLocal: (mobiAmount: number) => {
        const mobi = formatMobiAmount(mobiAmount);
        const local = formatLocalAmount(mobiAmount, "NGN");
        return { mobi, local, combined: mobi };
      },
      getLocalEquivalent: (mobiAmount: number) => mobiAmount,
      getCurrencySymbol: () => "₦",
      getCurrencyFlag: () => "🇳🇬",
    };
  }
  return context;
}

export { CurrencyContext };
