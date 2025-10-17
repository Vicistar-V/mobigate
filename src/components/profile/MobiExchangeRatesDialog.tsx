import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Plus, Trash2, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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

interface MobiExchangeRatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobiExchangeRatesDialog = ({ open, onOpenChange }: MobiExchangeRatesDialogProps) => {
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
    toast.success("Exchange rates updated");
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
      mobiPerUnit: 100,
      flag: "🌍"
    }]);
  };

  const handleDeleteCurrency = (id: string) => {
    setEditingRates(prev => prev.filter(rate => rate.id !== id));
  };

  const currentRates = isEditMode ? editingRates : exchangeRates;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg h-[85vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 pb-3 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Exchange Rates</DialogTitle>
            {isEditMode ? (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8">
                  <X className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={handleSave} className="h-8">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8">
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 px-4">
          <div className="py-4 space-y-3">
            {currentRates.map(rate => (
              <div key={rate.id} className="border rounded-lg p-3 bg-card">
                {isEditMode ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Input 
                        value={rate.flag} 
                        onChange={e => handleRateChange(rate.id, 'flag', e.target.value)} 
                        className="w-16 h-10 text-2xl text-center p-0"
                        maxLength={2}
                      />
                      <Input 
                        value={rate.code} 
                        onChange={e => handleRateChange(rate.id, 'code', e.target.value.toUpperCase())} 
                        className="flex-1 h-10"
                        maxLength={3}
                        placeholder="Code"
                      />
                      {rate.id !== "NGN" && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteCurrency(rate.id)} 
                          className="h-10 w-10 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <Input 
                      value={rate.currency} 
                      onChange={e => handleRateChange(rate.id, 'currency', e.target.value)} 
                      placeholder="Currency name"
                      className="h-10"
                    />
                    
                    <div className="flex gap-2">
                      <Input 
                        value={rate.symbol} 
                        onChange={e => handleRateChange(rate.id, 'symbol', e.target.value)} 
                        className="w-20 h-10"
                        placeholder="Symbol"
                      />
                      <div className="flex-1 relative">
                        <Input 
                          type="number" 
                          step="0.01" 
                          value={rate.mobiPerUnit || 0} 
                          onChange={e => handleRateChange(rate.id, 'mobiPerUnit', parseFloat(e.target.value) || 0)} 
                          className="h-10 pr-12"
                          placeholder="Rate"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          Mobi
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{rate.flag}</span>
                      <div>
                        <p className="font-semibold">{rate.code}</p>
                        <p className="text-xs text-muted-foreground">{rate.currency}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">1 {rate.symbol} =</p>
                      <p className="text-xl font-bold">M{(rate.mobiPerUnit || 0).toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isEditMode && (
              <Button 
                variant="outline" 
                className="w-full h-12"
                onClick={handleAddCurrency}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Currency
              </Button>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
