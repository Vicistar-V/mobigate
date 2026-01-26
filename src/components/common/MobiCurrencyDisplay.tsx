import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, RefreshCw } from "lucide-react";
import { 
  formatMobiAmount, 
  formatMobiWithLocal, 
  getSupportedCurrencies,
  convertFromMobi 
} from "@/lib/mobiCurrencyTranslation";
import { SUPPORTED_CURRENCIES } from "@/types/mobiFinancialProtocol";

interface MobiCurrencyDisplayProps {
  amount: number;
  showLocalEquivalent?: boolean;
  defaultCurrency?: string;
  allowCurrencyChange?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "badge" | "inline";
  className?: string;
}

export function MobiCurrencyDisplay({
  amount,
  showLocalEquivalent = true,
  defaultCurrency = "NGN",
  allowCurrencyChange = false,
  size = "md",
  variant = "default",
  className = "",
}: MobiCurrencyDisplayProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [isOpen, setIsOpen] = useState(false);

  const formatted = formatMobiWithLocal(amount, selectedCurrency);
  const currencies = getSupportedCurrencies();
  const currentCurrency = SUPPORTED_CURRENCIES.find(c => c.currencyCode === selectedCurrency);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const mobiSizeClasses = {
    sm: "text-base font-semibold",
    md: "text-lg font-bold",
    lg: "text-2xl font-bold",
  };

  if (variant === "badge") {
    return (
      <Badge variant="secondary" className={`${className}`}>
        {formatted.mobi}
      </Badge>
    );
  }

  if (variant === "inline") {
    return (
      <span className={`${sizeClasses[size]} ${className}`}>
        <span className="font-semibold text-primary">{formatted.mobi}</span>
        {showLocalEquivalent && (
          <span className="text-muted-foreground ml-1">
            (≈ {formatted.local})
          </span>
        )}
      </span>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Main Mobi amount */}
      <div className="flex items-center gap-2">
        <span className={`${mobiSizeClasses[size]} text-primary`}>
          {formatted.mobi}
        </span>
        
        {allowCurrencyChange && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
              >
                {currentCurrency?.countryFlag} {selectedCurrency}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="start">
              <div className="space-y-1">
                {currencies.map((currency) => (
                  <Button
                    key={currency.value}
                    variant={selectedCurrency === currency.value ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-sm h-8"
                    onClick={() => {
                      setSelectedCurrency(currency.value);
                      setIsOpen(false);
                    }}
                  >
                    <span className="mr-2">{currency.flag}</span>
                    {currency.value}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {currency.symbol}
                    </span>
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      {/* Local currency equivalent */}
      {showLocalEquivalent && (
        <span className={`${sizeClasses[size]} text-muted-foreground`}>
          ≈ {formatted.local}
        </span>
      )}
    </div>
  );
}

/**
 * Compact display for lists and cards - now with local currency equivalent
 */
interface MobiCompactDisplayProps {
  amount: number;
  showSign?: boolean;
  type?: "income" | "expense" | "neutral";
  showLocalEquivalent?: boolean;
  localCurrency?: string;
  className?: string;
}

export function MobiCompactDisplay({
  amount,
  showSign = false,
  type = "neutral",
  showLocalEquivalent = true,
  localCurrency = "NGN",
  className = "",
}: MobiCompactDisplayProps) {
  const colorClasses = {
    income: "text-green-600",
    expense: "text-red-600",
    neutral: "text-foreground",
  };

  const sign = showSign ? (type === "expense" ? "-" : "+") : "";
  const formatted = formatMobiWithLocal(amount, localCurrency);

  return (
    <span className={`font-semibold ${colorClasses[type]} ${className}`}>
      {sign}{formatMobiAmount(amount)}
      {showLocalEquivalent && (
        <span className="text-muted-foreground font-normal text-xs ml-1">
          ({formatted.local})
        </span>
      )}
    </span>
  );
}

/**
 * Currency conversion preview component
 */
interface CurrencyConversionPreviewProps {
  mobiAmount: number;
  className?: string;
}

export function CurrencyConversionPreview({
  mobiAmount,
  className = "",
}: CurrencyConversionPreviewProps) {
  const mainCurrencies = ["USD", "GBP", "EUR", "NGN"];
  
  return (
    <div className={`grid grid-cols-2 gap-2 text-sm ${className}`}>
      {mainCurrencies.map((currencyCode) => {
        const result = convertFromMobi(mobiAmount, currencyCode);
        const currency = SUPPORTED_CURRENCIES.find(c => c.currencyCode === currencyCode);
        
        return (
          <div 
            key={currencyCode}
            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
          >
            <span className="text-muted-foreground">
              {currency?.countryFlag} {currencyCode}
            </span>
            <span className="font-medium">
              {currency?.currencySymbol}
              {result.toAmount.toLocaleString(undefined, {
                minimumFractionDigits: currencyCode === "NGN" ? 0 : 2,
                maximumFractionDigits: currencyCode === "NGN" ? 0 : 2,
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
