import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Plus, Save, X, Trash2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const initialExchangeRates = [
  { id: "NGN", currency: "Nigerian Naira", code: "NGN", symbol: "₦", mobiPerUnit: 1.00, flag: "🇳🇬" },
  { id: "USD", currency: "US Dollar", code: "USD", symbol: "$", mobiPerUnit: 833.33, flag: "🇺🇸" },
  { id: "EUR", currency: "Euro", code: "EUR", symbol: "€", mobiPerUnit: 909.09, flag: "🇪🇺" },
  { id: "GBP", currency: "British Pound", code: "GBP", symbol: "£", mobiPerUnit: 1052.63, flag: "🇬🇧" },
  { id: "GHS", currency: "Ghanaian Cedi", code: "GHS", symbol: "₵", mobiPerUnit: 52.63, flag: "🇬🇭" },
  { id: "ZAR", currency: "South African Rand", code: "ZAR", symbol: "R", mobiPerUnit: 45.45, flag: "🇿🇦" },
  { id: "KES", currency: "Kenyan Shilling", code: "KES", symbol: "KSh", mobiPerUnit: 6.25, flag: "🇰🇪" },
  { id: "JPY", currency: "Japanese Yen", code: "JPY", symbol: "¥", mobiPerUnit: 5.56, flag: "🇯🇵" },
  { id: "CNY", currency: "Chinese Yuan", code: "CNY", symbol: "¥", mobiPerUnit: 115.74, flag: "🇨🇳" },
  { id: "INR", currency: "Indian Rupee", code: "INR", symbol: "₹", mobiPerUnit: 10.00, flag: "🇮🇳" },
  { id: "CAD", currency: "Canadian Dollar", code: "CAD", symbol: "C$", mobiPerUnit: 614.04, flag: "🇨🇦" },
  { id: "AUD", currency: "Australian Dollar", code: "AUD", symbol: "A$", mobiPerUnit: 543.48, flag: "🇦🇺" },
  { id: "AED", currency: "UAE Dirham", code: "AED", symbol: "د.إ", mobiPerUnit: 226.76, flag: "🇦🇪" },
  { id: "SAR", currency: "Saudi Riyal", code: "SAR", symbol: "﷼", mobiPerUnit: 222.22, flag: "🇸🇦" },
  { id: "EGP", currency: "Egyptian Pound", code: "EGP", symbol: "£", mobiPerUnit: 16.95, flag: "🇪🇬" },
  { id: "BRL", currency: "Brazilian Real", code: "BRL", symbol: "R$", mobiPerUnit: 166.67, flag: "🇧🇷" },
  { id: "MXN", currency: "Mexican Peso", code: "MXN", symbol: "$", mobiPerUnit: 48.78, flag: "🇲🇽" },
  { id: "CHF", currency: "Swiss Franc", code: "CHF", symbol: "Fr", mobiPerUnit: 934.58, flag: "🇨🇭" },
  { id: "SGD", currency: "Singapore Dollar", code: "SGD", symbol: "S$", mobiPerUnit: 617.28, flag: "🇸🇬" },
  { id: "THB", currency: "Thai Baht", code: "THB", symbol: "฿", mobiPerUnit: 24.39, flag: "🇹🇭" }
];

const availableCurrencies = [
  // Americas
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", flag: "🇦🇷" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", flag: "🇨🇱" },
  { code: "COP", name: "Colombian Peso", symbol: "$", flag: "🇨🇴" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", flag: "🇵🇪" },
  
  // Europe
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
  { code: "RON", name: "Romanian Leu", symbol: "lei", flag: "🇷🇴" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  
  // Asia
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩" },
  
  // Middle East
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼", flag: "🇶🇦" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", flag: "🇰🇼" },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", flag: "🇧🇭" },
  { code: "OMR", name: "Omani Rial", symbol: "﷼", flag: "🇴🇲" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا", flag: "🇯🇴" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪", flag: "🇮🇱" },
  
  // Africa
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", flag: "🇬🇭" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£", flag: "🇪🇬" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", flag: "🇹🇿" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", flag: "🇺🇬" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م.", flag: "🇲🇦" },
  { code: "XOF", name: "West African CFA Franc", symbol: "Fr", flag: "🌍" },
  { code: "XAF", name: "Central African CFA Franc", symbol: "Fr", flag: "🌍" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br", flag: "🇪🇹" },
  
  // Oceania
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
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
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showExistingForm, setShowExistingForm] = useState(false);
  const [customCurrency, setCustomCurrency] = useState({
    name: "",
    code: "",
    symbol: "",
    flag: "",
    mobiPerUnit: 100
  });

  const handleEdit = () => {
    setEditingRates([...exchangeRates]);
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setEditingRates([...exchangeRates]);
    setSelectedNewCurrency("");
    setShowCustomForm(false);
    setShowExistingForm(false);
    setCustomCurrency({ name: "", code: "", symbol: "", flag: "", mobiPerUnit: 100 });
    setIsEditMode(false);
  };

  const handleSave = () => {
    // Validate all rates are > 0
    const invalidRates = editingRates.filter(rate => (rate.mobiPerUnit || 0) <= 0);
    if (invalidRates.length > 0) {
      toast.error("All exchange rates must be greater than 0");
      return;
    }
    
    setExchangeRates([...editingRates]);
    setSelectedNewCurrency("");
    setShowCustomForm(false);
    setShowExistingForm(false);
    setCustomCurrency({ name: "", code: "", symbol: "", flag: "", mobiPerUnit: 100 });
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
    setShowExistingForm(false);
    toast.success(`${currencyData.name} added`);
  };

  const handleDeleteCurrency = (id: string) => {
    setEditingRates(prev => prev.filter(rate => rate.id !== id));
    toast.success("Currency removed");
  };

  const handleAddCustomCurrency = () => {
    // Validate custom currency fields
    if (!customCurrency.name.trim()) {
      toast.error("Currency name is required");
      return;
    }
    if (!customCurrency.code.trim() || customCurrency.code.length < 2) {
      toast.error("Currency code is required (min 2 characters)");
      return;
    }
    if (!customCurrency.symbol.trim()) {
      toast.error("Currency symbol is required");
      return;
    }
    if (customCurrency.mobiPerUnit <= 0) {
      toast.error("Mobi rate must be greater than 0");
      return;
    }

    // Check if code already exists
    const codeUpper = customCurrency.code.toUpperCase();
    if (editingRates.find(rate => rate.code === codeUpper)) {
      toast.error("This currency code already exists");
      return;
    }

    setEditingRates(prev => [...prev, {
      id: codeUpper,
      currency: customCurrency.name.trim(),
      code: codeUpper,
      symbol: customCurrency.symbol.trim(),
      mobiPerUnit: customCurrency.mobiPerUnit,
      flag: customCurrency.flag.trim() || "🌐"
    }]);
    
    setCustomCurrency({ name: "", code: "", symbol: "", flag: "", mobiPerUnit: 100 });
    setShowCustomForm(false);
    toast.success(`${customCurrency.name} added successfully`);
  };

  const currentRates = isEditMode ? editingRates : exchangeRates;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md h-[90vh] p-0 gap-0 flex flex-col">
        {/* Fixed Header */}
        <DialogHeader className="px-3 py-3 border-b flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-base font-semibold">Exchange Rates</DialogTitle>
            {isEditMode ? (
              <div className="flex gap-1.5">
                <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 px-2">
                  <X className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" onClick={handleSave} className="h-8 px-3 text-xs">
                  <Save className="h-3.5 w-3.5 mr-1" />
                  Save
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 px-3 text-xs">
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 px-3">
          <div className="py-3 space-y-2.5 pb-3">
            {/* Minimalist Info Section */}
            <div className="px-2.5 py-1.5 rounded-md bg-muted/30 border border-border/50">
              <p className="text-[11px] text-muted-foreground leading-snug">
                Set exchange rates: 1 currency unit = X Mobi
              </p>
            </div>

            {currentRates.map(rate => (
              <Card key={rate.id} className="p-3">
                {isEditMode ? (
                  // Edit Mode
                  <div className="space-y-2.5">
                    {/* Currency Header (Read-only) */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{rate.flag}</span>
                        <div>
                          <p className="font-semibold text-sm leading-tight">{rate.code}</p>
                          <p className="text-[10px] text-muted-foreground leading-tight">{rate.currency}</p>
                        </div>
                      </div>
                      {rate.id !== "NGN" && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteCurrency(rate.id)} 
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>

                    {/* Rate Input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-muted-foreground block">
                        1 {rate.symbol} = how many Mobi?
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground pointer-events-none">
                          M
                        </span>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0.01"
                          value={rate.mobiPerUnit || 0} 
                          onChange={e => {
                            const value = e.target.value;
                            if (value === '' || parseFloat(value) >= 0) {
                              handleRateChange(rate.id, value);
                            }
                          }}
                          onKeyDown={e => {
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                              e.preventDefault();
                            }
                          }}
                          className="h-10 pl-7 text-base font-semibold"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{rate.flag}</span>
                      <div>
                        <p className="font-semibold text-sm leading-tight">{rate.code}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">{rate.currency}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground mb-0.5">1 {rate.symbol} =</p>
                      <p className="text-base font-bold">M{(rate.mobiPerUnit || 0).toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Fixed Bottom: Add Currency Sections (Edit Mode Only) */}
        {isEditMode && (
          <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
            <div className="p-2.5 space-y-2">
              {/* Add Existing Currency - Collapsible */}
              <Collapsible open={showExistingForm} onOpenChange={setShowExistingForm}>
                <Card className="border-dashed">
                  <CollapsibleTrigger asChild>
                    <button className="w-full px-2.5 py-2 flex items-center justify-between hover:bg-accent/50 transition-colors rounded-lg">
                      <span className="text-xs font-medium">Add Existing</span>
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showExistingForm ? 'rotate-180' : ''}`} />
                    </button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-2.5 pb-2.5 pt-0.5">
                      <div className="flex gap-1.5">
                        <Select value={selectedNewCurrency} onValueChange={setSelectedNewCurrency}>
                          <SelectTrigger className="h-9 flex-1 text-xs">
                            <SelectValue placeholder="Select">
                              {selectedNewCurrency && (
                                <span className="truncate">
                                  {availableCurrencies.find(c => c.code === selectedNewCurrency)?.flag}{" "}
                                  {selectedNewCurrency}
                                </span>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="w-[220px]">
                            {availableCurrencies
                              .filter(c => !currentRates.find(r => r.code === c.code))
                              .map(currency => (
                                <SelectItem key={currency.code} value={currency.code} className="py-2">
                                  <div className="flex items-start gap-1.5 w-full overflow-hidden">
                                    <span className="text-base flex-shrink-0">{currency.flag}</span>
                                    <div className="flex flex-col overflow-hidden flex-1">
                                      <span className="font-semibold text-[11px]">{currency.code}</span>
                                      <span className="text-[9px] text-muted-foreground truncate block">{currency.name}</span>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          onClick={handleAddCurrency}
                          disabled={!selectedNewCurrency}
                          size="sm"
                          className="h-9 px-2.5"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Add Custom Currency - Collapsible */}
              <Collapsible open={showCustomForm} onOpenChange={setShowCustomForm}>
                <Card className="border-dashed">
                  <CollapsibleTrigger asChild>
                    <button className="w-full px-2.5 py-2 flex items-center justify-between hover:bg-accent/50 transition-colors rounded-lg">
                      <span className="text-xs font-medium">Add Custom</span>
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showCustomForm ? 'rotate-180' : ''}`} />
                    </button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-2.5 pb-2.5 pt-0.5 space-y-1.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        <Input
                          placeholder="Name"
                          value={customCurrency.name}
                          onChange={e => setCustomCurrency(prev => ({ ...prev, name: e.target.value }))}
                          className="h-8 text-xs"
                        />
                        <Input
                          placeholder="Code"
                          value={customCurrency.code}
                          onChange={e => setCustomCurrency(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                          maxLength={5}
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <Input
                          placeholder="Symbol"
                          value={customCurrency.symbol}
                          onChange={e => setCustomCurrency(prev => ({ ...prev, symbol: e.target.value }))}
                          className="h-8 text-xs"
                        />
                        <Input
                          placeholder="Flag"
                          value={customCurrency.flag}
                          onChange={e => setCustomCurrency(prev => ({ ...prev, flag: e.target.value }))}
                          maxLength={4}
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                          M
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="Mobi rate"
                          value={customCurrency.mobiPerUnit}
                          onChange={e => {
                            const value = parseFloat(e.target.value) || 0;
                            setCustomCurrency(prev => ({ ...prev, mobiPerUnit: value }));
                          }}
                          className="h-8 pl-6 text-xs"
                        />
                      </div>

                      <Button 
                        size="sm"
                        className="w-full h-8 text-xs"
                        onClick={handleAddCustomCurrency}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
