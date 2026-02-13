import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, AlertCircle, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransactionAuthorizationPanel } from "./TransactionAuthorizationPanel";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useIsMobile } from "@/hooks/use-mobile";

interface WalletTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock member data
const mockMembers = [
  { id: "1", name: "John Smith", avatar: "/placeholder.svg", memberNo: "M001" },
  { id: "2", name: "Sarah Johnson", avatar: "/placeholder.svg", memberNo: "M002" },
  { id: "3", name: "Michael Chen", avatar: "/placeholder.svg", memberNo: "M003" },
  { id: "4", name: "Emily Davis", avatar: "/placeholder.svg", memberNo: "M004" },
];

export function WalletTransferDialog({ open, onOpenChange }: WalletTransferDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<typeof mockMembers[0] | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState<"select" | "details" | "confirm" | "authorize">("select");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const walletBalance = 50000; // Mock balance

  const filteredMembers = mockMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.memberNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMember = (member: typeof mockMembers[0]) => {
    setSelectedMember(member);
    setStep("details");
  };

  const handleContinue = () => {
    const transferAmount = parseFloat(amount);
    
    if (!amount || transferAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (transferAmount > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this transfer",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a reason for this transfer",
        variant: "destructive",
      });
      return;
    }

    setStep("confirm");
  };

  const handleProceedToAuthorize = () => {
    setStep("authorize");
  };

  const handleConfirmTransfer = () => {
    const amountVal = parseFloat(amount);
    toast({
      title: "Transfer Successful!",
      description: `₦${amountVal.toLocaleString()} (M${amountVal.toLocaleString()}) sent to ${selectedMember?.name}`,
    });
    onOpenChange(false);
    // Reset
    setTimeout(() => {
      setSearchQuery("");
      setSelectedMember(null);
      setAmount("");
      setDescription("");
      setStep("select");
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
      setSearchQuery("");
      setSelectedMember(null);
      setAmount("");
      setDescription("");
      setStep("select");
    }, 300);
  };

  const renderSelectStep = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 touch-manipulation"
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        {filteredMembers.map((member) => (
          <Card
            key={member.id}
            className="p-3 cursor-pointer hover:bg-accent active:bg-accent/80 transition-colors touch-manipulation"
            onClick={() => handleSelectMember(member)}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.memberNo}</p>
              </div>
              <Badge variant="outline" className="shrink-0">Member</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <Card className="p-4 bg-muted">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={selectedMember?.avatar} alt={selectedMember?.name} />
            <AvatarFallback>{selectedMember?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{selectedMember?.name}</p>
            <p className="text-sm text-muted-foreground">{selectedMember?.memberNo}</p>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="amount">Transfer Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            ₦
          </span>
          <Input
            id="amount"
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-8 text-lg touch-manipulation"
            autoComplete="off"
          />
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <AlertCircle className="h-3 w-3 shrink-0" />
          Available balance: {formatLocalAmount(walletBalance, "NGN")} ({formatMobiAmount(walletBalance)})
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Transfer Description</Label>
        <Textarea
          id="description"
          placeholder="E.g., Payment for event, Donation, etc."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="touch-manipulation resize-none"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={handleContinue} className="w-full">
          Continue
        </Button>
        <Button variant="outline" onClick={() => setStep("select")} className="w-full">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Send className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-bold">Confirm Transfer</h3>
        <p className="text-sm text-muted-foreground">
          Please review the details
        </p>
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Recipient</span>
          <span className="font-medium text-right">{selectedMember?.name}</span>
        </div>
        <div className="flex justify-between text-sm border-t pt-2">
          <span className="text-muted-foreground">Amount</span>
          <div className="text-right">
            <span className="font-bold text-lg">{formatLocalAmount(parseFloat(amount), "NGN")}</span>
            <p className="text-xs text-muted-foreground">
              ({formatMobiAmount(parseFloat(amount))})
            </p>
          </div>
        </div>
        <div className="flex justify-between text-sm border-t pt-2">
          <span className="text-muted-foreground">Description</span>
          <span className="font-medium text-right max-w-[180px] line-clamp-2">
            {description}
          </span>
        </div>
      </Card>

      <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-xs text-yellow-800 dark:text-yellow-200">
          <strong>Note:</strong> This transaction requires multi-signature authorization.
        </p>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={handleProceedToAuthorize} className="w-full">
          Proceed to Authorization
        </Button>
        <Button variant="outline" onClick={() => setStep("details")} className="w-full">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>
    </div>
  );

  const renderAuthorizeStep = () => (
    <TransactionAuthorizationPanel
      transactionType="transfer"
      amount={parseFloat(amount)}
      recipient={selectedMember?.name || ""}
      description={description}
      onConfirm={handleConfirmTransfer}
      onBack={() => setStep("confirm")}
      onExpire={handleAuthorizationExpired}
    />
  );

  const content = (
    <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 pb-4">
      {step === "select" && renderSelectStep()}
      {step === "details" && selectedMember && renderDetailsStep()}
      {step === "confirm" && selectedMember && renderConfirmStep()}
      {step === "authorize" && selectedMember && renderAuthorizeStep()}
    </div>
  );

  // Mobile: Use Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[92vh] flex flex-col overflow-hidden touch-auto">
          <DrawerHeader className="pb-2 border-b shrink-0">
            <DrawerTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Transfer Funds
            </DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Use Dialog
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-2 shrink-0 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Transfer Funds
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
