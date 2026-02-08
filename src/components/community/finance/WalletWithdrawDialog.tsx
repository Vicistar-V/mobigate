import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Wallet, Building2, Plus, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransactionAuthorizationPanel } from "./TransactionAuthorizationPanel";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { getMinimumWithdrawal } from "@/data/platformSettingsData";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(mockBankAccounts[0].id);
  const [step, setStep] = useState<"amount" | "account" | "confirm" | "authorize">("amount");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const { toast } = useToast();

  const walletBalance = 50000; // Mock balance
  const minWithdrawal = getMinimumWithdrawal(); // Dynamic minimum from platform settings (M10,000)

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
        description: `Minimum withdrawal amount is ${formatMobiAmount(minWithdrawal)} (≈ ${formatLocalAmount(minWithdrawal, "NGN")})`,
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

  const handleProceedToAuthorize = () => {
    setStep("authorize");
  };

  const handleConfirmWithdrawal = () => {
    const account = mockBankAccounts.find((acc) => acc.id === selectedAccount);
    toast({
      title: "Withdrawal Successful!",
      description: `${formatMobiAmount(parseFloat(amount))} (≈ ${formatLocalAmount(parseFloat(amount), "NGN")}) has been sent to ${account?.bankName}`,
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

  const handleAuthorizationExpired = () => {
    toast({
      title: "Authorization Expired",
      description: "The 24-hour authorization window has expired. Please start again.",
      variant: "destructive",
    });
    handleClose();
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

  // Shared content as JSX variable (NOT a component function) to prevent remounting on state changes
  const withdrawContent = (
    <div className="flex-1 min-h-0 overflow-y-auto touch-auto overscroll-contain">
      <div className="px-2 pb-6 space-y-4">
        {step === "amount" && (
          <div className="space-y-4">
            <Card className="p-3 bg-muted">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">{formatMobiAmount(walletBalance)}</p>
              <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(walletBalance, "NGN")}</p>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Withdrawal Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  M
                </span>
                <Input
                  id="withdraw-amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d*\.?\d*$/.test(val)) {
                      setAmount(val);
                    }
                  }}
                  className="pl-8 h-12 touch-manipulation"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Minimum withdrawal: {formatMobiAmount(minWithdrawal)} (≈ {formatLocalAmount(minWithdrawal, "NGN")})
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

            <Button onClick={handleContinue} className="w-full h-12 touch-manipulation">
              Continue
            </Button>
          </div>
        )}

        {step === "account" && (
          <div className="space-y-4">
            <Card className="p-3 bg-muted">
              <p className="text-sm text-muted-foreground">Withdrawal Amount</p>
              <p className="text-2xl font-bold">{formatMobiAmount(parseFloat(amount))}</p>
              <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(parseFloat(amount), "NGN")}</p>
            </Card>

            <div className="space-y-2">
              <Label>Select Bank Account</Label>
              <RadioGroup value={selectedAccount} onValueChange={setSelectedAccount}>
                {mockBankAccounts.map((account) => (
                  <Card key={account.id} className="p-3 touch-manipulation">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value={account.id} id={account.id} className="mt-1" />
                      <Label htmlFor={account.id} className="flex-1 cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Building2 className="h-5 w-5 text-primary shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-sm">{account.bankName}</p>
                              <p className="text-xs text-muted-foreground">
                                {account.accountNumber}
                              </p>
                              <p className="text-xs text-muted-foreground">{account.accountName}</p>
                            </div>
                          </div>
                          {account.isPrimary && (
                            <Badge variant="secondary" className="text-xs shrink-0">
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
                className="w-full h-12 touch-manipulation"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Bank Account
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={handleSelectAccount} className="w-full h-12 touch-manipulation">
                Continue
              </Button>
              <Button variant="outline" onClick={() => setStep("amount")} className="w-full h-12 touch-manipulation">
                Back
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && selectedAccountDetails && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Confirm Withdrawal</h3>
              <p className="text-xs text-muted-foreground">
                Please review the details before proceeding
              </p>
            </div>

            <Card className="p-3 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <div className="text-right">
                  <span className="font-bold text-base">{formatMobiAmount(parseFloat(amount))}</span>
                  <p className="text-xs text-muted-foreground">≈ {formatLocalAmount(parseFloat(amount), "NGN")}</p>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bank</span>
                <span className="font-medium text-right">{selectedAccountDetails.bankName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account</span>
                <span className="font-medium">{selectedAccountDetails.accountNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Name</span>
                <span className="font-medium text-right">{selectedAccountDetails.accountName}</span>
              </div>
            </Card>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> This transaction requires multi-signature authorization from community executives.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={handleProceedToAuthorize} className="w-full h-12 touch-manipulation">
                Proceed to Authorization
              </Button>
              <Button variant="outline" onClick={() => setStep("account")} className="w-full h-12 touch-manipulation">
                Back
              </Button>
            </div>
          </div>
        )}

        {step === "authorize" && selectedAccountDetails && (
          <TransactionAuthorizationPanel
            transactionType="withdrawal"
            amount={parseFloat(amount)}
            bankName={selectedAccountDetails.bankName}
            accountNumber={selectedAccountDetails.accountNumber}
            onConfirm={handleConfirmWithdrawal}
            onBack={() => setStep("confirm")}
            onExpire={handleAuthorizationExpired}
          />
        )}

        {/* Add Account Modal */}
        {showAddAccount && (
          <div className="absolute inset-0 bg-background z-50 p-4 space-y-4">
            <div>
              <h3 className="text-lg font-bold mb-2">Add Bank Account</h3>
              <p className="text-sm text-muted-foreground">Enter your bank account details</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input
                  placeholder="Select your bank..."
                  className="h-12 touch-manipulation"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input
                  placeholder="0000000000"
                  className="h-12 touch-manipulation"
                  inputMode="numeric"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="space-y-2">
                <Label>Account Name</Label>
                <Input placeholder="Will be verified automatically" disabled className="h-12" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={handleAddAccount} className="w-full h-12 touch-manipulation">
                Add Account
              </Button>
              <Button variant="outline" onClick={() => setShowAddAccount(false)} className="w-full h-12 touch-manipulation">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[92vh] flex flex-col overflow-hidden">
          <DrawerHeader className="pb-2 border-b shrink-0">
            <DrawerTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Withdraw Funds
            </DrawerTitle>
          </DrawerHeader>
          {withdrawContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-2 shrink-0 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Withdraw Funds
          </DialogTitle>
        </DialogHeader>
        {withdrawContent}
      </DialogContent>
    </Dialog>
  );
}
