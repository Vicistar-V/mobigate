import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockGifts, mockReceivedGifts } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Gift, Wallet } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ProfileGiftsTabProps {
  userName: string;
  userId?: string;
}

export const ProfileGiftsTab = ({ userName }: ProfileGiftsTabProps) => {
  const { toast } = useToast();
  const [selectedGift, setSelectedGift] = useState<string>("");
  const [walletBalance] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const totalGiftsValue = mockReceivedGifts.reduce((sum, gift) => sum + gift.mobiValue, 0);
  const totalGiftsCount = mockReceivedGifts.length;

  const handleSendGift = () => {
    if (!selectedGift) {
      toast({
        title: "No Gift Selected",
        description: "Please choose a gift to send",
        variant: "destructive",
      });
      return;
    }

    const gift = mockGifts.find(g => g.id === selectedGift);
    if (!gift) return;

    if (walletBalance < gift.mobiValue) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${gift.mobiValue} Mobi to send this gift. Your balance is ${walletBalance} Mobi.`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Gift Sent!",
      description: `You sent ${gift.name} to ${userName}`,
    });
    setSelectedGift("");
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold uppercase">
          {userName} HAS RECEIVED {totalGiftsCount} GIFT{totalGiftsCount !== 1 ? 'S' : ''} WORTH {totalGiftsValue.toLocaleString()} Mobi
        </h2>
      </div>

      {/* Send Gift Section */}
      <Card>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <h3 className="text-base font-bold uppercase">
              SEND {userName} A GIFT
            </h3>
            <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="p-4 pt-0 space-y-4">
              {/* Wallet Balance */}
              <div className="bg-warning/20 border border-warning p-3 rounded-md flex items-center gap-2">
                <Wallet className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">WALLET BALANCE {walletBalance} Mobi</span>
              </div>

              {/* Gift Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Choose A Gift</label>
                <Select value={selectedGift} onValueChange={setSelectedGift}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a gift..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGifts.map((gift) => (
                      <SelectItem key={gift.id} value={gift.id}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{gift.icon}</span>
                          <span>{gift.name} - {gift.mobiValue} Mobi</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Send Button */}
              <Button 
                onClick={handleSendGift}
                style={{ backgroundColor: 'hsl(var(--accent))' }}
                className="w-full text-accent-foreground"
              >
                <Gift className="h-4 w-4" />
                Send Gift
              </Button>

              {/* Status Message */}
              <p className="text-sm text-muted-foreground text-center">
                You have not gifted {userName}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Received Gifts */}
      {mockReceivedGifts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-base font-bold uppercase">RECEIVED GIFTS</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {mockReceivedGifts.map((gift) => (
              <Card key={gift.giftId} className="p-3 space-y-2">
                <div className="text-3xl text-center">{gift.icon}</div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-center">{gift.giftName}</p>
                  <p className="text-xs text-primary text-center">{gift.mobiValue} Mobi</p>
                  <p className="text-xs text-muted-foreground text-center">From: {gift.fromUserName}</p>
                  <p className="text-xs text-muted-foreground text-center">{gift.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
