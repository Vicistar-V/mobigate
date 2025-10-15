import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

const currencies = [
  { code: "MOBI", name: "Mobi", symbol: "M", rate: 1 }, // 1 MOBI = 1 NGN baseline
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", rate: 1 },
  { code: "USD", name: "US Dollar", symbol: "$", rate: 0.0012 }, // Approximate
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.0011 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.00095 },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", rate: 0.019 },
  { code: "ZAR", name: "South African Rand", symbol: "R", rate: 0.022 },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", rate: 0.16 },
];

interface CurrencyExchangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CurrencyExchangeDialog = ({ open, onOpenChange }: CurrencyExchangeDialogProps) => {
  const [fromCurrency, setFromCurrency] = useState("MOBI");
  const [toCurrency, setToCurrency] = useState("NGN");
  const [fromAmount, setFromAmount] = useState("100");
  const [toAmount, setToAmount] = useState("100");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const calculateConversion = (amount: string, from: string, to: string) => {
    const amountNum = parseFloat(amount) || 0;
    const fromRate = currencies.find(c => c.code === from)?.rate || 1;
    const toRate = currencies.find(c => c.code === to)?.rate || 1;
    
    // Convert to NGN first (baseline), then to target currency
    const inNGN = amountNum * (1 / fromRate);
    const result = inNGN * toRate;
    
    return result.toFixed(2);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setToAmount(calculateConversion(value, fromCurrency, toCurrency));
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    setFromAmount(calculateConversion(value, toCurrency, fromCurrency));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const refreshRates = () => {
    setLastUpdated(new Date());
    // In production, this would fetch latest rates from API
  };

  useEffect(() => {
    setToAmount(calculateConversion(fromAmount, fromCurrency, toCurrency));
  }, [fromCurrency, toCurrency]);

  const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
  const toCurrencyData = currencies.find(c => c.code === toCurrency);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md p-4 pt-12 sm:p-6 sm:pt-14">
        <DialogHeader className="pr-14 sm:pr-16">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <ArrowRightLeft className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            Currency Exchange Converter
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* From Currency */}
          <Card className="p-3 sm:p-4">
            <Label className="text-xs sm:text-sm text-muted-foreground mb-2 block">From</Label>
            <div className="space-y-2 sm:space-y-3">
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code} className="text-sm">
                      {currency.symbol} {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="text-xl sm:text-2xl font-bold h-12 sm:h-14"
                placeholder="0.00"
              />
            </div>
          </Card>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 sm:-my-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
              onClick={swapCurrencies}
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* To Currency */}
          <Card className="p-3 sm:p-4 bg-muted/50">
            <Label className="text-xs sm:text-sm text-muted-foreground mb-2 block">To</Label>
            <div className="space-y-2 sm:space-y-3">
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code} className="text-sm">
                      {currency.symbol} {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={toAmount}
                onChange={(e) => handleToAmountChange(e.target.value)}
                className="text-xl sm:text-2xl font-bold h-12 sm:h-14 bg-background"
                placeholder="0.00"
              />
            </div>
          </Card>

          {/* Exchange Rate Info */}
          <Card className="p-3 sm:p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground">Exchange Rate</p>
                <p className="text-sm sm:text-base font-semibold truncate">
                  1 {fromCurrencyData?.symbol} {fromCurrency} = {calculateConversion("1", fromCurrency, toCurrency)} {toCurrencyData?.symbol} {toCurrency}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={refreshRates}
                className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
              >
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </Card>

          {/* Mobi Info Note */}
          {(fromCurrency === "MOBI" || toCurrency === "MOBI") && (
            <Card className="p-2.5 sm:p-3 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900">
              <p className="text-[10px] sm:text-xs text-amber-800 dark:text-amber-200">
                💡 <strong>Mobi Rate:</strong> 1 Mobi = 1 Nigerian Naira (baseline)
              </p>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
