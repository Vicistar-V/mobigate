import { useState } from "react";
import { X, Heart, DollarSign, CreditCard, Smartphone, Building } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

const presetAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

const paymentMethods = [
  { id: "card", label: "Debit/Credit Card", icon: CreditCard },
  { id: "bank", label: "Bank Transfer", icon: Building },
  { id: "mobile", label: "Mobile Money", icon: Smartphone }
];

export function DonationDialog({ open, onOpenChange }: DonationDialogProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleSelectAmount = (value: number) => {
    setAmount(value.toString());
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setAmount("");
  };

  const handleDonate = () => {
    const donationAmount = customAmount || amount;
    
    if (!donationAmount || parseInt(donationAmount) < 500) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount of at least NGN 500",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Thank You for Your Donation! 💝",
      description: `Your donation of NGN ${parseInt(donationAmount).toLocaleString()} will make a difference`,
    });
    
    // Reset form
    setAmount("");
    setCustomAmount("");
    setMessage("");
    setIsAnonymous(false);
    onOpenChange(false);
  };

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
            {/* Preset Amounts */}
            <div>
              <label className="text-sm font-medium mb-3 block">Choose Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset.toString() ? "default" : "outline"}
                    onClick={() => handleSelectAmount(preset)}
                    className="h-auto py-3 flex-col"
                  >
                    <DollarSign className="h-4 w-4 mb-1" />
                    <span className="font-bold">NGN {(preset / 1000)}K</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="text-sm font-medium mb-2 block">Or Enter Custom Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  NGN
                </span>
                <Input
                  type="number"
                  placeholder="Enter amount..."
                  value={customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  className="pl-14"
                  min="500"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Minimum donation: NGN 500
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
            {(amount || customAmount) && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Donation Amount:</span>
                    <span className="text-xl font-bold">
                      NGN {parseInt(customAmount || amount).toLocaleString()}
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
            {(amount || customAmount) &&
              `NGN ${parseInt(customAmount || amount).toLocaleString()}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
