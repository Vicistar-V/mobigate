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
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [step, setStep] = useState<"select" | "details" | "confirm">("select");
  const { toast } = useToast();

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

  const handleConfirm = () => {
    toast({
      title: "Transfer Successful!",
      description: `₦${parseFloat(amount).toLocaleString()} sent to ${selectedMember?.name}`,
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Transfer Funds
          </DialogTitle>
        </DialogHeader>

        {step === "select" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {filteredMembers.map((member) => (
                  <Card
                    key={member.id}
                    className="p-3 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleSelectMember(member)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.memberNo}</p>
                      </div>
                      <Badge variant="outline">Member</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {step === "details" && selectedMember && (
          <div className="space-y-4">
            <Card className="p-4 bg-muted">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                  <AvatarFallback>{selectedMember.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{selectedMember.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedMember.memberNo}</p>
                </div>
              </div>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="amount">Transfer Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₦
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Available balance: ₦{walletBalance.toLocaleString()}
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
              />
            </div>

            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setStep("select")} className="w-full sm:w-auto">
                Back
              </Button>
              <Button onClick={handleContinue} className="w-full sm:w-auto">
                Continue
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "confirm" && selectedMember && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Send className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Confirm Transfer</h3>
              <p className="text-sm text-muted-foreground">
                Please review the details before confirming
              </p>
            </div>

            <Card className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recipient</span>
                <span className="font-medium">{selectedMember.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-lg">₦{parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Description</span>
                <span className="font-medium text-right max-w-[200px] line-clamp-2">
                  {description}
                </span>
              </div>
            </Card>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> This transaction cannot be reversed once confirmed. Please verify all details.
              </p>
            </div>

            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setStep("details")} className="w-full sm:w-auto">
                Back
              </Button>
              <Button onClick={handleConfirm} className="w-full sm:w-auto">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm Transfer
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
