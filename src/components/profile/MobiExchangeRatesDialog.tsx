import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Plus, Save, X, Trash2, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

const initialExchangeRates = [
  { id: "NGN", currency: "Nigerian Naira", code: "NGN", symbol: "₦", mobiPerUnit: 1.00, flag: "🇳🇬" },
  { id: "USD", currency: "US Dollar", code: "USD", symbol: "$", mobiPerUnit: 833.33, flag: "🇺🇸" },
  { id: "EUR", currency: "Euro", code: "EUR", symbol: "€", mobiPerUnit: 909.09, flag: "🇪🇺" },
  { id: "GBP", currency: "British Pound", code: "GBP", symbol: "£", mobiPerUnit: 1052.63, flag: "🇬🇧" },
  { id: "GHS", currency: "Ghanaian Cedi", code: "GHS", symbol: "₵", mobiPerUnit: 52.63, flag: "🇬🇭" },
  { id: "ZAR", currency: "South African Rand", code: "ZAR", symbol: "R", mobiPerUnit: 45.45, flag: "🇿🇦" },
  { id: "KES", currency: "Kenyan Shilling", code: "KES", symbol: "KSh", mobiPerUnit: 6.25, flag: "🇰🇪" },
  { id: "JPY", currency: "Japanese Yen", code: "JPY", symbol: "¥", mobiPerUnit: 5.56, flag: "🇯🇵" }
];

const availableCurrencies = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", flag: "🇬🇭" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
];

interface MobiExchangeRatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobiExchangeRatesDialog = ({ open, onOpenChange }: MobiExchangeRatesDialogProps) => {
  const [exchangeRates, setExchangeRates] = useState(initialExchangeRates);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRates, setEditingRates] = useState(initialExchangeRates);
  const [selectedNewCurrency, setSelectedNewCurrency] = useState<string>("");

  const handleEdit = () => {
    setEditingRates([...exchangeRates]);
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setEditingRates([...exchangeRates]);
    setSelectedNewCurrency("");
    setIsEditMode(false);
  };

  const handleSave = () => {
    // Validate all rates are > 0
    const invalidRates = editingRates.filter(rate => rate.id !== "NGN" && (rate.mobiPerUnit || 0) <= 0);
    if (invalidRates.length > 0) {
      toast.error("All exchange rates must be greater than 0");
      return;
    }
    
    setExchangeRates([...editingRates]);
    setSelectedNewCurrency("");
    setIsEditMode(false);
    toast.success("Exchange rates updated successfully");
  };

  const handleRateChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setEditingRates(prev => prev.map(rate => 
      rate.id === id ? { ...rate, mobiPerUnit: numValue } : rate
    ));
  };

  const handleAddCurrency = () => {
    if (!selectedNewCurrency) {
      toast.error("Please select a currency");
      return;
    }

    // Check if currency already exists
    if (editingRates.find(rate => rate.code === selectedNewCurrency)) {
      toast.error("This currency is already added");
      return;
    }

    const currencyData = availableCurrencies.find(c => c.code === selectedNewCurrency);
    if (!currencyData) return;

    setEditingRates(prev => [...prev, {
      id: selectedNewCurrency,
      currency: currencyData.name,
      code: currencyData.code,
      symbol: currencyData.symbol,
      mobiPerUnit: 100,
      flag: currencyData.flag
    }]);
    setSelectedNewCurrency("");
    toast.success(`${currencyData.name} added`);
  };

  const handleDeleteCurrency = (id: string) => {
    setEditingRates(prev => prev.filter(rate => rate.id !== id));
    toast.success("Currency removed");
  };

  const currentRates = isEditMode ? editingRates : exchangeRates;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md h-[90vh] p-0 gap-0 flex flex-col">
        {/* Fixed Header */}
        <DialogHeader className="p-4 pb-3 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Exchange Rates</DialogTitle>
            {isEditMode ? (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel} className="h-9">
                  <X className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={handleSave} className="h-9">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleEdit} className="h-9">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Baseline Info Banner */}
        <div className="px-4 pt-4 flex-shrink-0">
          <Card className="p-3 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-primary mb-1">Baseline Currency</p>
                <p className="text-muted-foreground">
                  1 ₦ = 1 Mobi (cannot be changed)
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 px-4">
          <div className="py-4 space-y-3">
            {currentRates.map(rate => {
              const isNaira = rate.id === "NGN";
              
              return (
                <Card key={rate.id} className={`p-4 ${isNaira ? 'bg-muted/30 border-2' : ''}`}>
                  {isEditMode ? (
                    // Edit Mode
                    <div className="space-y-3">
                      {/* Currency Header (Read-only) */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{rate.flag}</span>
                          <div>
                            <p className="font-semibold text-base">{rate.code}</p>
                            <p className="text-xs text-muted-foreground">{rate.currency}</p>
                          </div>
                        </div>
                        {!isNaira && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteCurrency(rate.id)} 
                            className="h-9 w-9 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* Rate Input */}
                      {isNaira ? (
                        <div className="bg-muted/50 rounded-lg p-3 border-2 border-dashed">
                          <p className="text-sm text-muted-foreground text-center">
                            Locked at <span className="font-semibold text-foreground">1 ₦ = 1 Mobi</span>
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground block">
                            1 {rate.symbol} equals how many Mobi?
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground pointer-events-none">
                              M
                            </span>
                            <Input 
                              type="number" 
                              step="0.01" 
                              min="0.01"
                              value={rate.mobiPerUnit || 0} 
                              onChange={e => {
                                const value = e.target.value;
                                // Only allow positive numbers
                                if (value === '' || parseFloat(value) >= 0) {
                                  handleRateChange(rate.id, value);
                                }
                              }}
                              onKeyDown={e => {
                                // Prevent minus sign and other non-numeric keys except decimal
                                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                  e.preventDefault();
                                }
                              }}
                              className="h-12 pl-8 text-lg font-semibold"
                              placeholder="0.00"
                              readOnly={false}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{rate.flag}</span>
                        <div>
                          <p className="font-semibold text-base">{rate.code}</p>
                          <p className="text-xs text-muted-foreground">{rate.currency}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-0.5">1 {rate.symbol} =</p>
                        <p className="text-2xl font-bold">M{(rate.mobiPerUnit || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
            
            {/* Add Currency Section (Edit Mode Only) */}
            {isEditMode && (
              <Card className="p-4 border-dashed">
                <div className="space-y-3">
                  <p className="text-sm font-medium">Add New Currency</p>
                  <div className="flex gap-2">
                    <Select value={selectedNewCurrency} onValueChange={setSelectedNewCurrency}>
                      <SelectTrigger className="h-11 flex-1">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCurrencies
                          .filter(c => !currentRates.find(r => r.code === c.code))
                          .map(currency => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <span className="flex items-center gap-2">
                                <span>{currency.flag}</span>
                                <span>{currency.code} - {currency.name}</span>
                              </span>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleAddCurrency}
                      disabled={!selectedNewCurrency}
                      className="h-11"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
