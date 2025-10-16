import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, RefreshCw, Info, Edit, Plus, Trash2, Save, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const initialExchangeRates = [
  { 
    id: "NGN",
    currency: "Nigerian Naira", 
    code: "NGN", 
    symbol: "₦", 
    rate: 1.00, 
    change: 0,
    flag: "🇳🇬"
  },
  { 
    id: "USD",
    currency: "US Dollar", 
    code: "USD", 
    symbol: "$", 
    rate: 0.0012, 
    change: 0.02,
    flag: "🇺🇸"
  },
  { 
    id: "EUR",
    currency: "Euro", 
    code: "EUR", 
    symbol: "€", 
    rate: 0.0011, 
    change: -0.01,
    flag: "🇪🇺"
  },
  { 
    id: "GBP",
    currency: "British Pound", 
    code: "GBP", 
    symbol: "£", 
    rate: 0.00095, 
    change: 0.015,
    flag: "🇬🇧"
  },
  { 
    id: "GHS",
    currency: "Ghanaian Cedi", 
    code: "GHS", 
    symbol: "₵", 
    rate: 0.019, 
    change: -0.005,
    flag: "🇬🇭"
  },
  { 
    id: "ZAR",
    currency: "South African Rand", 
    code: "ZAR", 
    symbol: "R", 
    rate: 0.022, 
    change: 0.008,
    flag: "🇿🇦"
  },
  { 
    id: "KES",
    currency: "Kenyan Shilling", 
    code: "KES", 
    symbol: "KSh", 
    rate: 0.16, 
    change: 0.012,
    flag: "🇰🇪"
  },
  { 
    id: "JPY",
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
  const [exchangeRates, setExchangeRates] = useState(initialExchangeRates);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRates, setEditingRates] = useState(initialExchangeRates);

  const handleEdit = () => {
    setEditingRates([...exchangeRates]);
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setEditingRates([...exchangeRates]);
    setIsEditMode(false);
  };

  const handleSave = () => {
    setExchangeRates([...editingRates]);
    setIsEditMode(false);
    toast.success("Exchange rates updated successfully");
  };

  const handleRateChange = (id: string, field: string, value: string | number) => {
    setEditingRates(prev => prev.map(rate => 
      rate.id === id ? { ...rate, [field]: value } : rate
    ));
  };

  const handleAddCurrency = () => {
    const newId = `CUSTOM_${Date.now()}`;
    setEditingRates(prev => [...prev, {
      id: newId,
      currency: "New Currency",
      code: "XXX",
      symbol: "$",
      rate: 0.01,
      change: 0,
      flag: "🌍"
    }]);
  };

  const handleDeleteCurrency = (id: string) => {
    if (id === "NGN") {
      toast.error("Cannot delete the baseline currency");
      return;
    }
    setEditingRates(prev => prev.filter(rate => rate.id !== id));
  };

  const currentRates = isEditMode ? editingRates : exchangeRates;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] p-3 pt-10 sm:p-6 sm:pt-14">
        <DialogHeader className="pr-12 sm:pr-16">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-xl">
            <Badge variant="default" className="text-sm sm:text-lg px-2 py-0.5">M</Badge>
            <span>Mobi Exchange Rates</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Action Buttons Row */}
        <div className="flex justify-end gap-2 -mt-2">
          {isEditMode ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleCancel} className="h-7 text-xs sm:h-8 sm:text-sm">
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSave} className="h-7 text-xs sm:h-8 sm:text-sm">
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleEdit} className="h-7 w-7 sm:h-8 sm:w-8">
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </>
          )}
        </div>

        <div className="space-y-3">
          {/* Baseline Info */}
          <Alert className="py-2">
            <Info className="h-3 w-3 sm:h-4 sm:w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              <strong>Baseline Rate:</strong> 1 Mobi (M) = 1 Nigerian Naira (₦)
            </AlertDescription>
          </Alert>

          {/* Exchange Rates List */}
          <ScrollArea className="h-[450px] sm:h-[500px] pr-2 sm:pr-4">
            <div className="space-y-2">
              {currentRates.map((rate) => (
                <Card key={rate.id} className="p-2.5 sm:p-4 hover:bg-muted/50 transition-colors">
                  {isEditMode ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground">Flag</label>
                            <Input 
                              value={rate.flag}
                              onChange={(e) => handleRateChange(rate.id, 'flag', e.target.value)}
                              className="h-8 text-xl"
                              maxLength={2}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Currency Name</label>
                            <Input 
                              value={rate.currency}
                              onChange={(e) => handleRateChange(rate.id, 'currency', e.target.value)}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Code</label>
                            <Input 
                              value={rate.code}
                              onChange={(e) => handleRateChange(rate.id, 'code', e.target.value.toUpperCase())}
                              className="h-8 text-xs"
                              maxLength={3}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Symbol</label>
                            <Input 
                              value={rate.symbol}
                              onChange={(e) => handleRateChange(rate.id, 'symbol', e.target.value)}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Rate (1 Mobi =)</label>
                            <Input 
                              type="number"
                              step="0.0001"
                              value={rate.rate}
                              onChange={(e) => handleRateChange(rate.id, 'rate', parseFloat(e.target.value) || 0)}
                              className="h-8 text-xs"
                              disabled={rate.code === "NGN"}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Change %</label>
                            <Input 
                              type="number"
                              step="0.01"
                              value={rate.change}
                              onChange={(e) => handleRateChange(rate.id, 'change', parseFloat(e.target.value) || 0)}
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                        {rate.code !== "NGN" && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteCurrency(rate.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-xl sm:text-3xl shrink-0">{rate.flag}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm sm:text-lg font-semibold truncate">{rate.currency}</p>
                            <p className="text-xs sm:text-base text-muted-foreground">{rate.code}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-base sm:text-2xl font-bold whitespace-nowrap">
                            {rate.symbol}{rate.code === "NGN" ? rate.rate.toFixed(2) : rate.rate.toFixed(4)}
                          </p>
                          {rate.change !== 0 && (
                            <div className="flex items-center gap-1 justify-end">
                              {rate.change > 0 ? (
                                <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-600" />
                              ) : (
                                <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-600" />
                              )}
                              <span className={`text-xs sm:text-sm font-medium ${
                                rate.change > 0 ? "text-emerald-600" : "text-red-600"
                              }`}>
                                {rate.change > 0 ? "+" : ""}{(rate.change * 100).toFixed(2)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator className="my-2" />

                      <div className="flex flex-col gap-0.5 text-xs sm:text-sm text-muted-foreground">
                        <span className="truncate">1 Mobi = {rate.symbol}{rate.code === "NGN" ? rate.rate.toFixed(2) : rate.rate.toFixed(4)} {rate.code}</span>
                        <span className="truncate">1 {rate.code} = M{(1 / rate.rate).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </Card>
              ))}
              
              {isEditMode && (
                <Button 
                  variant="outline" 
                  className="w-full text-xs sm:text-sm" 
                  onClick={handleAddCurrency}
                >
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  Add Currency
                </Button>
              )}
            </div>
          </ScrollArea>

          {/* Footer Info */}
          <Card className="p-2 bg-muted/30">
            <p className="text-xs sm:text-sm text-muted-foreground text-center leading-tight">
              Last updated: {lastUpdated.toLocaleString()} • Rates are indicative and may vary
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
