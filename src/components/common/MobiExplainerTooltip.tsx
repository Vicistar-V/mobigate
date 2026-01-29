import { Info, Globe } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MobiExplainerTooltipProps {
  /**
   * Size of the info icon
   */
  size?: "sm" | "md";
  /**
   * Optional custom className
   */
  className?: string;
}

/**
 * A tooltip that explains the Mobi currency system to users
 */
export function MobiExplainerTooltip({ size = "sm", className }: MobiExplainerTooltipProps) {
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className={`${iconSize} text-muted-foreground cursor-help ${className}`} />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3">
          <div className="space-y-2">
            <p className="text-xs font-medium flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Local-First Currency
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All community transactions are conducted in your <strong>local currency</strong> and 
              automatically converted to <strong>Mobi (M)</strong>, Mobigate's universal platform currency.
            </p>
            <p className="text-xs text-muted-foreground">
              Current rate: <strong>₦1 = M1</strong>
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface MobiCurrencyInfoBannerProps {
  /**
   * Optional community currency code to show the conversion rate
   */
  currencyCode?: string;
  /**
   * Optional className for custom styling
   */
  className?: string;
}

/**
 * An informational banner explaining local currency and Mobi conversion
 * Follows the Local-First Dual Currency Protocol
 */
export function MobiCurrencyInfoBanner({ 
  currencyCode = "NGN",
  className 
}: MobiCurrencyInfoBannerProps) {
  // Get the rate display based on currency
  const getRateDisplay = () => {
    switch (currencyCode) {
      case "NGN":
        return "₦1 = M1";
      case "USD":
        return "$1 = M500";
      case "GBP":
        return "£1 = M550";
      case "EUR":
        return "€1 = M450";
      case "ZAR":
        return "R1 = M25";
      case "CAD":
        return "CAD$1 = M350";
      default:
        return "₦1 = M1";
    }
  };

  const getCurrencySymbol = () => {
    switch (currencyCode) {
      case "NGN": return "₦";
      case "USD": return "$";
      case "GBP": return "£";
      case "EUR": return "€";
      case "ZAR": return "R";
      case "CAD": return "CAD$";
      default: return "₦";
    }
  };
  
  return (
    <div className={`flex items-start gap-2 p-3 bg-primary/5 rounded-lg ${className}`}>
      <Globe className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <div className="text-xs text-muted-foreground">
        <p>
          All community transactions are in <strong>{getCurrencySymbol()} ({currencyCode})</strong>, 
          your local currency, and automatically converted to <strong>Mobi (M)</strong> equivalents.
        </p>
        <p className="mt-1 font-medium">
          Current rate: {getRateDisplay()}
        </p>
      </div>
    </div>
  );
}