import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FundRaiserCampaign, currencyRates } from "@/data/fundraiserData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, AlertTriangle, Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
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

interface DonationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: FundRaiserCampaign | null;
}

interface DonationContentProps {
  campaign: FundRaiserCampaign;
  onOpenChange: (open: boolean) => void;
}

const DonationContent = ({ campaign, onOpenChange }: DonationContentProps) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<'USD' | 'MOBI'>('USD');
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const getConvertedAmount = () => {
    const amt = parseFloat(amount) || 0;
    if (currency === 'USD') {
      return `M ${(amt * currencyRates.USD_TO_MOBI).toLocaleString()}`;
    } else {
      return `$${(amt * currencyRates.MOBI_TO_USD).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    }
  };

  const getFormattedAmount = () => {
    const amt = parseFloat(amount) || 0;
    if (currency === 'USD') {
      return `M${(amt * currencyRates.USD_TO_MOBI).toLocaleString()}`;
    } else {
      return `M${amt.toLocaleString()}`;
    }
  };

  const handleDonate = () => {
    const amt = parseFloat(amount);
    if (!amt || amt < campaign.minimumDonation) {
      toast({
        title: "Invalid Amount",
        description: `Minimum donation is $${campaign.minimumDonation}`,
        variant: "destructive",
      });
      return;
    }

    // Show confirmation dialog instead of processing directly
    setShowConfirmation(true);
  };

  const handleConfirmDonate = () => {
    const amt = parseFloat(amount);
    
    toast({
      title: "Donation Successful!",
      description: `Thank you for donating ${currency === 'USD' ? '$' : 'M'}${amt.toLocaleString()} to ${campaign.theme}`,
    });

    // Reset and close
    setAmount("");
    setMessage("");
    setIsAnonymous(false);
    setShowConfirmation(false);
    onOpenChange(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <h2 className="text-lg font-semibold">Make a Donation</h2>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 pb-6">
          {/* Campaign Info */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-bold mb-2">{campaign.theme}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Convener: {campaign.convenerName}
            </p>
            <p className="text-sm">
              <span className="font-semibold">${campaign.raisedAmount.toLocaleString()}</span>
              {" "}raised of ${campaign.targetAmount.toLocaleString()} goal
            </p>
          </div>

          {/* Donation Amount */}
          <div className="space-y-3">
            <Label>Donation Amount</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => setCurrency(currency === 'USD' ? 'MOBI' : 'USD')}
                className="min-w-[80px]"
              >
                {currency === 'USD' ? 'US$' : 'Mobi'}
              </Button>
            </div>
            {amount && (
              <p className="text-sm text-muted-foreground">
                ≈ {getConvertedAmount()}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Minimum donation: ${campaign.minimumDonation}
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label>Quick Select</Label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 25, 50, 100, 250, 500].map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(String(amt))}
                >
                  ${amt}
                </Button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label>Message (Optional)</Label>
            <Textarea
              placeholder="Leave a message of support..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="anonymous" className="cursor-pointer">
              Donate anonymously
            </Label>
          </div>

          {/* Donate Button */}
          <Button
            onClick={handleDonate}
            className="w-full bg-green-600 hover:bg-green-700 font-bold text-lg py-6"
          >
            <DollarSign className="h-5 w-5 mr-2" />
            Donate Now
          </Button>

          {/* Secure Payment Notice */}
          <p className="text-xs text-center text-muted-foreground">
            Your donation is secure and will be processed immediately
          </p>
        </div>
      </ScrollArea>

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
              <span className="font-bold text-foreground">{getFormattedAmount()}</span> to this Community. 
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
    </div>
  );
};

export const DonationSheet = ({
  open,
  onOpenChange,
  campaign,
}: DonationSheetProps) => {
  const isMobile = useIsMobile();

  if (!campaign) return null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[90vh] overflow-hidden">
          <DonationContent campaign={campaign} onOpenChange={onOpenChange} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden p-0">
        <DonationContent campaign={campaign} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};
