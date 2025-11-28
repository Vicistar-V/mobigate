import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FundRaiserCampaign, currencyRates } from "@/data/fundraiserData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DollarSign } from "lucide-react";

interface DonationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: FundRaiserCampaign | null;
}

export const DonationSheet = ({
  open,
  onOpenChange,
  campaign,
}: DonationSheetProps) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<'USD' | 'MOBI'>('USD');
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();

  if (!campaign) return null;

  const getConvertedAmount = () => {
    const amt = parseFloat(amount) || 0;
    if (currency === 'USD') {
      return `M ${(amt * currencyRates.USD_TO_MOBI).toLocaleString()}`;
    } else {
      return `$${(amt * currencyRates.MOBI_TO_USD).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
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

    toast({
      title: "Donation Successful!",
      description: `Thank you for donating ${currency === 'USD' ? '$' : 'M'}${amt.toLocaleString()} to ${campaign.theme}`,
    });

    // Reset and close
    setAmount("");
    setMessage("");
    setIsAnonymous(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle>Make a Donation</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6 overflow-y-auto h-[calc(90vh-80px)]">
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
      </SheetContent>
    </Sheet>
  );
};
