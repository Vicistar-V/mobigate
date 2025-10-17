import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Plus, Trash2, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const initialExchangeRates = [{
  id: "NGN",
  currency: "Nigerian Naira",
  code: "NGN",
  symbol: "₦",
  mobiPerUnit: 1.00,
  flag: "🇳🇬"
}, {
  id: "USD",
  currency: "US Dollar",
  code: "USD",
  symbol: "$",
  mobiPerUnit: 833.33,
  flag: "🇺🇸"
}, {
  id: "EUR",
  currency: "Euro",
  code: "EUR",
  symbol: "€",
  mobiPerUnit: 909.09,
  flag: "🇪🇺"
}, {
  id: "GBP",
  currency: "British Pound",
  code: "GBP",
  symbol: "£",
  mobiPerUnit: 1052.63,
  flag: "🇬🇧"
}, {
  id: "GHS",
  currency: "Ghanaian Cedi",
  code: "GHS",
  symbol: "₵",
  mobiPerUnit: 52.63,
  flag: "🇬🇭"
}, {
  id: "ZAR",
  currency: "South African Rand",
  code: "ZAR",
  symbol: "R",
  mobiPerUnit: 45.45,
  flag: "🇿🇦"
}, {
  id: "KES",
  currency: "Kenyan Shilling",
  code: "KES",
  symbol: "KSh",
  mobiPerUnit: 6.25,
  flag: "🇰🇪"
}, {
  id: "JPY",
  currency: "Japanese Yen",
  code: "JPY",
  symbol: "¥",
  mobiPerUnit: 5.56,
  flag: "🇯🇵"
}];
interface MobiExchangeRatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export const MobiExchangeRatesDialog = ({
  open,
  onOpenChange
}: MobiExchangeRatesDialogProps) => {
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
    setEditingRates(prev => prev.map(rate => rate.id === id ? {
      ...rate,
      [field]: value
    } : rate));
  };
  const handleAddCurrency = () => {
    const newId = `CUSTOM_${Date.now()}`;
    setEditingRates(prev => [...prev, {
      id: newId,
      currency: "New Currency",
      code: "XXX",
      symbol: "$",
      mobiPerUnit: 100,
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
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[75vh] p-3 pt-10 sm:p-6 sm:pt-14">
        <DialogHeader className="pr-12 sm:pr-16">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-xl">
            <Badge variant="default" className="text-sm sm:text-lg px-2 py-0.5">MX</Badge>
            <span>Mobi Exchange Rates</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Action Buttons Row */}
        <div className="flex justify-end gap-2 -mt-2">
          {isEditMode ? <>
              <Button variant="ghost" size="sm" onClick={handleCancel} className="h-7 text-xs sm:h-8 sm:text-sm">
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSave} className="h-7 text-xs sm:h-8 sm:text-sm">
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Save
              </Button>
            </> : <Button variant="ghost" size="icon" onClick={handleEdit} className="h-7 w-7 sm:h-8 sm:w-8">
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>}
        </div>

        <div className="space-y-3">
          {/* Baseline Info */}
          <div className="text-xs sm:text-sm text-muted-foreground border-l-2 border-primary/50 pl-3 py-1">
            <span className="font-medium">Baseline:</span> 1 Mobi (M) = 1 ₦
          </div>

          {/* Exchange Rates List */}
          <ScrollArea className="h-[280px] sm:h-[400px] pr-2 sm:pr-4">
            <div className="space-y-2">
              {currentRates.map(rate => <Card key={rate.id} className="p-3 sm:p-4">
                  {isEditMode ? <div className="flex items-start gap-2">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground">Flag</label>
                          <Input value={rate.flag} onChange={e => handleRateChange(rate.id, 'flag', e.target.value)} className="h-9 text-xl" maxLength={2} />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Currency Name</label>
                          <Input value={rate.currency} onChange={e => handleRateChange(rate.id, 'currency', e.target.value)} className="h-9 text-sm" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Code</label>
                          <Input value={rate.code} onChange={e => handleRateChange(rate.id, 'code', e.target.value.toUpperCase())} className="h-9 text-sm" maxLength={3} />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Symbol</label>
                          <Input value={rate.symbol} onChange={e => handleRateChange(rate.id, 'symbol', e.target.value)} className="h-9 text-sm" />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs text-muted-foreground">Mobi per 1 {rate.code}</label>
                          <Input type="number" step="0.01" value={rate.mobiPerUnit} onChange={e => handleRateChange(rate.id, 'mobiPerUnit', parseFloat(e.target.value) || 0)} className="h-9 text-sm" disabled={rate.code === "NGN"} />
                        </div>
                      </div>
                      {rate.code !== "NGN" && <Button variant="ghost" size="icon" onClick={() => handleDeleteCurrency(rate.id)} className="h-9 w-9 text-destructive hover:text-destructive shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>}
                    </div> : <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl">{rate.flag}</span>
                        <div>
                          <p className="text-sm sm:text-base font-medium">{rate.code}</p>
                          <p className="text-xs text-muted-foreground">{rate.currency}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">1 {rate.symbol} =</p>
                        <p className="text-lg sm:text-xl font-bold">M{rate.mobiPerUnit.toFixed(2)}</p>
                      </div>
                    </div>}
                </Card>)}
              
              {isEditMode && <Button variant="outline" className="w-full text-xs sm:text-sm" onClick={handleAddCurrency}>
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  Add Currency
                </Button>}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>;
};