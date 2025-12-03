import { useState } from "react";
import { X, Heart, CreditCard, Smartphone, Building, Wallet, Coins, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface DonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Comprehensive currency list
const currencies = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "MOBI", name: "Mobi", symbol: "M" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" },
  { code: "RWF", name: "Rwandan Franc", symbol: "FRw" },
  { code: "XOF", name: "West African CFA", symbol: "CFA" },
  { code: "XAF", name: "Central African CFA", symbol: "FCFA" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "MAD" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
];

// Preset amounts in standard number format (₦5,000 to ₦10,000,000)
const presetAmounts = [
  5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000,
  100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000,
  1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000, 10000000
];

// Payment methods including Mobi Wallet and Mobi Credit
const paymentMethods = [
  { id: "mobi-wallet", label: "Mobi Wallet", icon: Wallet },
  { id: "mobi-credit", label: "Mobi Credit", icon: Coins },
  { id: "card", label: "Debit/Credit Card", icon: CreditCard },
  { id: "bank", label: "Bank Transfer", icon: Building },
  { id: "mobile", label: "Mobile Money", icon: Smartphone },
];

export function DonationDialog({ open, onOpenChange }: DonationDialogProps) {
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]); // Default: NGN
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mobi-wallet");

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      setSelectedCurrency(currency);
      // Reset amounts when currency changes
      setAmount("");
      setCustomAmount("");
    }
  };

  const handleSelectAmount = (value: number) => {
    setAmount(value.toString());
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setAmount("");
  };

  // Format amount with currency symbol (e.g., ₦5,000)
  const formatAmount = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    if (isNaN(numValue)) return "";
    return `${selectedCurrency.symbol}${numValue.toLocaleString()}`;
  };

  const handleDonate = () => {
    const donationAmount = customAmount || amount;
    
    // Minimum donation: 1,000
    if (!donationAmount || parseInt(donationAmount) < 1000) {
      toast({
        title: "Invalid Amount",
        description: `Please enter an amount of at least ${selectedCurrency.symbol}1,000`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Thank You for Your Donation! 💝",
      description: `Your donation of ${formatAmount(donationAmount)} will make a difference`,
    });
    
    // Reset form
    setAmount("");
    setCustomAmount("");
    setMessage("");
    setIsAnonymous(false);
    onOpenChange(false);
  };

  const currentAmount = customAmount || amount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0 sticky top-0 bg-background z-10 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-500/10 p-2 rounded-lg">
                <Heart className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Make a Donation</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Support community development projects
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-140px)]">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Currency Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Currency</label>
              <Select value={selectedCurrency.code} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{selectedCurrency.symbol}</span>
                      <span>{selectedCurrency.name}</span>
                      <span className="text-muted-foreground">({selectedCurrency.code})</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold w-8">{currency.symbol}</span>
                        <span>{currency.name}</span>
                        <span className="text-muted-foreground">({currency.code})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preset Amounts - Scrollable Grid */}
            <div>
              <label className="text-sm font-medium mb-3 block">Choose Amount</label>
              <div className="max-h-[200px] overflow-y-auto pr-1 border rounded-lg p-2">
                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((preset) => (
                    <Button
                      key={preset}
                      variant={amount === preset.toString() ? "default" : "outline"}
                      onClick={() => handleSelectAmount(preset)}
                      className="h-auto py-2.5 px-2 text-xs sm:text-sm font-semibold"
                    >
                      {selectedCurrency.symbol}{preset.toLocaleString()}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="text-sm font-medium mb-2 block">Or Enter Custom Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  {selectedCurrency.symbol}
                </span>
                <Input
                  type="number"
                  placeholder="Enter amount..."
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className="pl-10"
                  min="1000"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Minimum donation: {selectedCurrency.symbol}1,000
              </p>
            </div>

            {/* Donation Message */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Personal Message (Optional)
              </label>
              <Textarea
                placeholder="Leave a message of support..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            {/* Anonymous Option */}
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="anonymous" className="font-medium cursor-pointer">
                      Donate Anonymously
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your name won't be displayed publicly
                    </p>
                  </div>
                  <Switch
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <div>
              <label className="text-sm font-medium mb-3 block">Payment Method</label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-2">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label
                          htmlFor={method.id}
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                        >
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{method.label}</span>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>

            {/* Summary */}
            {currentAmount && parseInt(currentAmount) > 0 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Donation Amount:</span>
                    <span className="text-xl font-bold">
                      {formatAmount(currentAmount)}
                    </span>
                  </div>
                  {!isAnonymous && (
                    <p className="text-xs text-muted-foreground">
                      Your donation will be publicly acknowledged
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-background sticky bottom-0">
          <Button onClick={handleDonate} className="w-full" size="lg">
            <Heart className="h-4 w-4 mr-2" />
            Donate{" "}
            {currentAmount && parseInt(currentAmount) > 0 && formatAmount(currentAmount)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
