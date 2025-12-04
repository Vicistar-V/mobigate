import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Wallet, CreditCard, Smartphone, Building2, CheckCircle2, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VoucherDenominationSelector } from "./VoucherDenominationSelector";
import { SelectedVoucher, calculateVoucherTotals } from "@/data/rechargeVouchersData";

interface WalletTopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletTopUpDialog({ open, onOpenChange }: WalletTopUpDialogProps) {
  const [selectedVouchers, setSelectedVouchers] = useState<SelectedVoucher[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [step, setStep] = useState<"vouchers" | "payment" | "confirm">("vouchers");
  const { toast } = useToast();

  const totals = calculateVoucherTotals(selectedVouchers);

  const handleContinueToPayment = () => {
    if (selectedVouchers.length === 0) {
      toast({
        title: "No Vouchers Selected",
        description: "Please select at least one voucher denomination",
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
      description: `${totals.totalMobi.toLocaleString()} Mobi has been added to your wallet`,
    });
    onOpenChange(false);
    setTimeout(() => {
      setSelectedVouchers([]);
      setPaymentMethod("card");
      setStep("vouchers");
    }, 300);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSelectedVouchers([]);
      setPaymentMethod("card");
      setStep("vouchers");
    }, 300);
  };

  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case "card":
        return "Debit/Credit Card";
      case "transfer":
        return "Bank Transfer";
      case "mobile":
        return "Mobile Money";
      default:
        return paymentMethod;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Top Up Wallet
          </DialogTitle>
        </DialogHeader>

        {step === "vouchers" && (
          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            <VoucherDenominationSelector
              selectedVouchers={selectedVouchers}
              onSelectionChange={setSelectedVouchers}
            />

            <DialogFooter className="mt-auto pt-2">
              <Button
                onClick={handleContinueToPayment}
                className="w-full"
                disabled={selectedVouchers.length === 0}
              >
                Continue to Payment
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <Card className="p-4 bg-muted">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vouchers Selected</span>
                  <span className="font-medium">{totals.totalVouchers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount to Pay</span>
                  <div className="text-right">
                    <p className="text-xl font-bold">₦{totals.totalNgn.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">(US${totals.totalUsd})</p>
                  </div>
                </div>
                <div className="flex justify-between pt-2 border-t text-sm">
                  <span className="text-muted-foreground">Mobi Credit</span>
                  <span className="font-semibold text-primary">{totals.totalMobi.toLocaleString()} Mobi</span>
                </div>
              </div>
            </Card>

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
              <Button variant="outline" onClick={() => setStep("vouchers")} className="w-full sm:w-auto">
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
                <p className="font-medium mb-2">Vouchers:</p>
                {selectedVouchers.map((sv) => (
                  <div key={sv.voucher.id} className="flex justify-between text-muted-foreground">
                    <span>{sv.voucher.mobiValue.toLocaleString()} Mobi × {sv.quantity}</span>
                    <span>₦{(sv.voucher.ngnPrice * sv.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-bold">₦{totals.totalNgn.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mobi Credit</span>
                    <span className="font-semibold text-primary">{totals.totalMobi.toLocaleString()} Mobi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium">{getPaymentMethodLabel()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-green-600 font-medium">Processing</span>
                  </div>
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
