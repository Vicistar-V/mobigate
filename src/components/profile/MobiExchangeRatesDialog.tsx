import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, RefreshCw, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const exchangeRates = [
  { 
    currency: "Nigerian Naira", 
    code: "NGN", 
    symbol: "₦", 
    rate: 1.00, 
    change: 0,
    flag: "🇳🇬"
  },
  { 
    currency: "US Dollar", 
    code: "USD", 
    symbol: "$", 
    rate: 0.0012, 
    change: 0.02,
    flag: "🇺🇸"
  },
  { 
    currency: "Euro", 
    code: "EUR", 
    symbol: "€", 
    rate: 0.0011, 
    change: -0.01,
    flag: "🇪🇺"
  },
  { 
    currency: "British Pound", 
    code: "GBP", 
    symbol: "£", 
    rate: 0.00095, 
    change: 0.015,
    flag: "🇬🇧"
  },
  { 
    currency: "Ghanaian Cedi", 
    code: "GHS", 
    symbol: "₵", 
    rate: 0.019, 
    change: -0.005,
    flag: "🇬🇭"
  },
  { 
    currency: "South African Rand", 
    code: "ZAR", 
    symbol: "R", 
    rate: 0.022, 
    change: 0.008,
    flag: "🇿🇦"
  },
  { 
    currency: "Kenyan Shilling", 
    code: "KES", 
    symbol: "KSh", 
    rate: 0.16, 
    change: 0.012,
    flag: "🇰🇪"
  },
  { 
    currency: "Japanese Yen", 
    code: "JPY", 
    symbol: "¥", 
    rate: 0.18, 
    change: -0.02,
    flag: "🇯🇵"
  },
];

interface MobiExchangeRatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobiExchangeRatesDialog = ({ open, onOpenChange }: MobiExchangeRatesDialogProps) => {
  const lastUpdated = new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] p-4 pt-12 sm:p-6 sm:pt-14">
        <DialogHeader className="pr-14 sm:pr-16">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Badge variant="default" className="text-sm sm:text-base px-2 sm:px-3 py-0.5 sm:py-1">M</Badge>
            <span>Mobi Exchange Rates</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Refresh Button Row */}
        <div className="flex justify-end -mt-2 sm:-mt-3">
          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Baseline Info */}
          <Alert className="py-2 sm:py-3">
            <Info className="h-3 w-3 sm:h-4 sm:w-4" />
            <AlertDescription className="text-sm sm:text-base">
              <strong>Baseline Rate:</strong> 1 Mobi (M) = 1 Nigerian Naira (₦)
            </AlertDescription>
          </Alert>

          {/* Exchange Rates List */}
          <ScrollArea className="h-[450px] sm:h-[500px] pr-3 sm:pr-4">
            <div className="space-y-2">
              {exchangeRates.map((rate) => (
                <Card key={rate.code} className="p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <span className="text-2xl sm:text-3xl shrink-0">{rate.flag}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-base sm:text-lg font-semibold truncate">{rate.currency}</p>
                        <p className="text-sm sm:text-base text-muted-foreground">{rate.code}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-lg sm:text-2xl font-bold">
                        {rate.symbol}{rate.code === "NGN" ? rate.rate.toFixed(2) : rate.rate.toFixed(4)}
                      </p>
                      <div className="flex items-center gap-1 justify-end">
                        {rate.change !== 0 && (
                          <>
                            {rate.change > 0 ? (
                              <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 text-emerald-600" />
                            ) : (
                              <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3 text-red-600" />
                            )}
                            <span className={`text-xs sm:text-sm font-medium ${
                              rate.change > 0 ? "text-emerald-600" : "text-red-600"
                            }`}>
                              {rate.change > 0 ? "+" : ""}{(rate.change * 100).toFixed(2)}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                    <span className="truncate">1 Mobi = {rate.symbol}{rate.code === "NGN" ? rate.rate.toFixed(2) : rate.rate.toFixed(4)} {rate.code}</span>
                    <span className="truncate">1 {rate.code} = M{(1 / rate.rate).toFixed(2)}</span>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* Footer Info */}
          <Card className="p-2 sm:p-3 bg-muted/30">
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              Last updated: {lastUpdated.toLocaleString()} • Rates are indicative and may vary
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
