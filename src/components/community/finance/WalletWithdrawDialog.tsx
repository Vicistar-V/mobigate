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
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Wallet, Building2, Plus, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletWithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock bank accounts
const mockBankAccounts = [
  {
    id: "1",
    bankName: "First Bank of Nigeria",
    accountNumber: "0123456789",
    accountName: "John Doe",
    isPrimary: true,
  },
  {
    id: "2",
    bankName: "GTBank",
    accountNumber: "9876543210",
    accountName: "John Doe",
    isPrimary: false,
  },
];

export function WalletWithdrawDialog({ open, onOpenChange }: WalletWithdrawDialogProps) {
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(mockBankAccounts[0].id);
  const [step, setStep] = useState<"amount" | "account" | "confirm">("amount");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const { toast } = useToast();

  const walletBalance = 50000; // Mock balance
  const minWithdrawal = 1000;

  const handleContinue = () => {
    const withdrawAmount = parseFloat(amount);

    if (!amount || withdrawAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount < minWithdrawal) {
      toast({
        title: "Amount Too Low",
        description: `Minimum withdrawal amount is ₦${minWithdrawal.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    setStep("account");
  };

  const handleSelectAccount = () => {
    setStep("confirm");
  };

  const handleConfirm = () => {
    const account = mockBankAccounts.find((acc) => acc.id === selectedAccount);
    toast({
      title: "Withdrawal Initiated!",
      description: `₦${parseFloat(amount).toLocaleString()} will be sent to ${account?.bankName}`,
    });
    onOpenChange(false);
    // Reset
    setTimeout(() => {
      setAmount("");
      setSelectedAccount(mockBankAccounts[0].id);
      setStep("amount");
      setShowAddAccount(false);
    }, 300);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setAmount("");
      setSelectedAccount(mockBankAccounts[0].id);
      setStep("amount");
      setShowAddAccount(false);
    }, 300);
  };

  const handleAddAccount = () => {
    toast({
      title: "Add Bank Account",
      description: "This feature will allow you to add new bank accounts",
    });
    setShowAddAccount(false);
  };

  const selectedAccountDetails = mockBankAccounts.find((acc) => acc.id === selectedAccount);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Withdraw Funds
          </DialogTitle>
        </DialogHeader>

        {step === "amount" && (
          <div className="space-y-4">
            <Card className="p-4 bg-muted">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">₦{walletBalance.toLocaleString()}</p>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Withdrawal Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₦
                </span>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Minimum withdrawal: ₦{minWithdrawal.toLocaleString()}
              </p>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Processing Time</p>
                  <p>Withdrawals are typically processed within 1-3 business days</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleContinue} className="w-full">
                Continue
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "account" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Withdrawal Amount</p>
              <p className="text-2xl font-bold">₦{parseFloat(amount).toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <Label>Select Bank Account</Label>
              <RadioGroup value={selectedAccount} onValueChange={setSelectedAccount}>
                {mockBankAccounts.map((account) => (
                  <Card key={account.id} className="p-4">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value={account.id} id={account.id} className="mt-1" />
                      <Label htmlFor={account.id} className="flex-1 cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{account.bankName}</p>
                              <p className="text-sm text-muted-foreground">
                                {account.accountNumber}
                              </p>
                              <p className="text-xs text-muted-foreground">{account.accountName}</p>
                            </div>
                          </div>
                          {account.isPrimary && (
                            <Badge variant="secondary" className="text-xs">
                              Primary
                            </Badge>
                          )}
                        </div>
                      </Label>
                    </div>
                  </Card>
                ))}
              </RadioGroup>

              <Button
                variant="outline"
                onClick={() => setShowAddAccount(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Bank Account
              </Button>
            </div>

            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setStep("amount")} className="w-full sm:w-auto">
                Back
              </Button>
              <Button onClick={handleSelectAccount} className="w-full sm:w-auto">
                Continue
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "confirm" && selectedAccountDetails && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Confirm Withdrawal</h3>
              <p className="text-sm text-muted-foreground">
                Please review the details before confirming
              </p>
            </div>

            <Card className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-lg">₦{parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bank</span>
                <span className="font-medium">{selectedAccountDetails.bankName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account</span>
                <span className="font-medium">{selectedAccountDetails.accountNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Name</span>
                <span className="font-medium">{selectedAccountDetails.accountName}</span>
              </div>
            </Card>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> Processing may take 1-3 business days. Ensure your bank details are correct.
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setStep("account")} className="w-full sm:w-auto">
                Back
              </Button>
              <Button onClick={handleConfirm} className="w-full sm:w-auto">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm Withdrawal
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Add Account Modal */}
        {showAddAccount && (
          <div className="absolute inset-0 bg-background z-50 p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold mb-2">Add Bank Account</h3>
              <p className="text-sm text-muted-foreground">Enter your bank account details</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input placeholder="Select your bank..." />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input placeholder="0000000000" />
              </div>
              <div className="space-y-2">
                <Label>Account Name</Label>
                <Input placeholder="Will be verified automatically" disabled />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddAccount(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddAccount} className="flex-1">
                Add Account
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
