import { useState } from "react";
import { X, Heart, CreditCard, Smartphone, Building, Wallet, Coins, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface DonationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Community's local currency (configured per community)
const COMMUNITY_LOCAL_CURRENCY = {
  code: "NGN",
  name: "Nigerian Naira", 
  symbol: "₦",
  mobiExchangeRate: 1 // M1 = ₦1
};

// Preset amounts in Mobi Units (M5,000 to M10,000,000)
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
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mobi-wallet");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSelectAmount = (value: number) => {
    setAmount(value.toString());
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setAmount("");
  };

  // Format amount in Mobi Units (e.g., M5,000)
  const formatMobiAmount = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    if (isNaN(numValue)) return "";
    return `M${numValue.toLocaleString()}`;
  };

  // Format amount in local currency (e.g., ₦5,000)
  const formatLocalAmount = (mobiValue: number | string) => {
    const numValue = typeof mobiValue === 'string' ? parseInt(mobiValue) : mobiValue;
    if (isNaN(numValue)) return "";
    const localValue = numValue * COMMUNITY_LOCAL_CURRENCY.mobiExchangeRate;
    return `${COMMUNITY_LOCAL_CURRENCY.symbol}${localValue.toLocaleString()}`;
  };

  // Format dual currency display (e.g., M5,000 (₦5,000))
  const formatDualAmount = (mobiValue: number | string) => {
    const numValue = typeof mobiValue === 'string' ? parseInt(mobiValue) : mobiValue;
    if (isNaN(numValue)) return "";
    return `${formatMobiAmount(numValue)} (${formatLocalAmount(numValue)})`;
  };

  const handleDonate = () => {
    const donationAmount = customAmount || amount;
    
    // Minimum donation: M1,000
    if (!donationAmount || parseInt(donationAmount) < 1000) {
      toast({
        title: "Invalid Amount",
        description: `Please enter an amount of at least M1,000 (${COMMUNITY_LOCAL_CURRENCY.symbol}1,000)`,
        variant: "destructive"
      });
      return;
    }

    // Show confirmation dialog instead of processing directly
    setShowConfirmation(true);
  };

  const handleConfirmDonate = () => {
    const donationAmount = customAmount || amount;
    
    toast({
      title: "Thank You for Your Donation!",
      description: `Your donation of ${formatDualAmount(donationAmount)} will make a difference`,
    });
    
    // Reset form
    setAmount("");
    setCustomAmount("");
    setMessage("");
    setIsAnonymous(false);
    setShowConfirmation(false);
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
            {/* Exchange Rate Info */}
            <Card className="bg-muted/50 border-muted">
              <CardContent className="p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Rate:</span>
                  <span className="font-semibold">M1 = {COMMUNITY_LOCAL_CURRENCY.symbol}1</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Community Currency: {COMMUNITY_LOCAL_CURRENCY.name} ({COMMUNITY_LOCAL_CURRENCY.code})
                </p>
              </CardContent>
            </Card>

            {/* Preset Amounts - Scrollable Grid with Dual Currency */}
            <div>
              <label className="text-sm font-medium mb-3 block">Choose Amount</label>
              <div className="max-h-[220px] overflow-y-auto pr-1 border rounded-lg p-2">
                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((preset) => (
                    <Button
                      key={preset}
                      variant={amount === preset.toString() ? "default" : "outline"}
                      onClick={() => handleSelectAmount(preset)}
                      className="h-auto py-2 px-1.5 flex flex-col items-center gap-0.5"
                    >
                      <span className="text-xs sm:text-sm font-bold">
                        M{preset.toLocaleString()}
                      </span>
                      <span className="text-[10px] sm:text-xs opacity-70">
                        ({COMMUNITY_LOCAL_CURRENCY.symbol}{(preset * COMMUNITY_LOCAL_CURRENCY.mobiExchangeRate).toLocaleString()})
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Amount in Mobi */}
            <div>
              <label className="text-sm font-medium mb-2 block">Or Enter Custom Amount (Mobi)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  M
                </span>
                <Input
                  type="number"
                  placeholder="Enter amount in Mobi..."
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className="pl-8"
                  min="1000"
                />
              </div>
              {customAmount && parseInt(customAmount) > 0 && (
                <p className="text-sm text-primary font-medium mt-1">
                  = {formatLocalAmount(customAmount)} ({COMMUNITY_LOCAL_CURRENCY.name})
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Minimum donation: M1,000 ({COMMUNITY_LOCAL_CURRENCY.symbol}1,000)
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

            {/* Summary with Dual Currency */}
            {currentAmount && parseInt(currentAmount) > 0 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Donation Amount:</span>
                    <span className="text-xl font-bold">
                      {formatMobiAmount(currentAmount)}
                    </span>
                  </div>
                  <div className="text-right mb-2">
                    <span className="text-sm text-muted-foreground">
                      (= {formatLocalAmount(currentAmount)} {COMMUNITY_LOCAL_CURRENCY.code})
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

        {/* Footer Actions with Dual Currency */}
        <div className="p-4 border-t bg-background sticky bottom-0">
          <Button onClick={handleDonate} className="w-full" size="lg">
            <Heart className="h-4 w-4 mr-2" />
            {currentAmount && parseInt(currentAmount) > 0 ? (
              <span>
                Donate {formatMobiAmount(currentAmount)}{" "}
                <span className="opacity-80">({formatLocalAmount(currentAmount)})</span>
              </span>
            ) : (
              "Donate"
            )}
          </Button>
        </div>
      </DialogContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <div className="flex justify-center mb-2">
              <div className="bg-amber-500/10 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">Confirm Donation</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You are sending a monetary Donation of{" "}
              <span className="font-bold text-foreground">{formatMobiAmount(currentAmount)}</span> to this Community. 
              This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDonate}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              <Heart className="h-4 w-4 mr-2" />
              Donate Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
