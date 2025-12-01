import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Wallet, CreditCard, Smartphone, Building2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletTopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletTopUpDialog({ open, onOpenChange }: WalletTopUpDialogProps) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [step, setStep] = useState<"amount" | "payment" | "confirm">("amount");
  const { toast } = useToast();

  const presetAmounts = [5000, 10000, 20000, 50000];

  const handleSelectPreset = (value: number) => {
    setAmount(value.toString());
  };

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    setStep("payment");
  };

  const handlePayment = () => {
    setStep("confirm");
  };

  const handleConfirm = () => {
    toast({
      title: "Top Up Successful!",
      description: `₦${parseFloat(amount).toLocaleString()} has been added to your wallet`,
    });
    onOpenChange(false);
    // Reset
    setTimeout(() => {
      setAmount("");
      setPaymentMethod("card");
      setStep("amount");
    }, 300);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setAmount("");
      setPaymentMethod("card");
      setStep("amount");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Top Up Wallet
          </DialogTitle>
        </DialogHeader>

        {step === "amount" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Amount</Label>
              <div className="grid grid-cols-2 gap-2">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={amount === preset.toString() ? "default" : "outline"}
                    onClick={() => handleSelectPreset(preset)}
                    className="h-16 text-lg"
                  >
                    ₦{(preset / 1000).toFixed(0)}k
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-amount">Or Enter Custom Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₦
                </span>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleContinue} className="w-full">
                Continue
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Amount to Top Up</p>
              <p className="text-2xl font-bold">₦{parseFloat(amount).toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <Label>Select Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Debit/Credit Card</p>
                        <p className="text-xs text-muted-foreground">Instant processing</p>
                      </div>
                    </Label>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-xs text-muted-foreground">Processing within 24 hours</p>
                      </div>
                    </Label>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="mobile" id="mobile" />
                    <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Mobile Money</p>
                        <p className="text-xs text-muted-foreground">Instant processing</p>
                      </div>
                    </Label>
                  </div>
                </Card>
              </RadioGroup>
            </div>

            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setStep("amount")} className="w-full sm:w-auto">
                Back
              </Button>
              <Button onClick={handlePayment} className="w-full sm:w-auto">
                Proceed to Payment
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
              <p className="text-sm text-muted-foreground">
                Your wallet top-up is being processed
              </p>
            </div>

            <Card className="p-4 text-left bg-muted">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold">₦{parseFloat(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium capitalize">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-600 font-medium">Processing</span>
                </div>
              </div>
            </Card>

            <p className="text-xs text-muted-foreground">
              You'll receive a confirmation once the transaction is complete
            </p>

            <DialogFooter>
              <Button onClick={handleConfirm} className="w-full">
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
