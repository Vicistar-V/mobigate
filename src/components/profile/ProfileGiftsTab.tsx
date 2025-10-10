import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockGifts, mockReceivedGifts } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Gift } from "lucide-react";
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

  const totalGifts = mockReceivedGifts.length;
  const totalMobiValue = mockReceivedGifts.reduce((sum, gift) => sum + gift.mobiValue, 0);

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
        description: `You need ${gift.mobiValue.toLocaleString()} Mobi to send this gift`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Gift Sent!",
      description: `You sent ${gift.name} ${gift.icon} to ${userName}`,
    });
    setSelectedGift("");
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <h2 className="text-xl font-bold uppercase">
          {userName} HAS RECEIVED {totalGifts} GIFT{totalGifts !== 1 ? 'S' : ''} WORTH {totalMobiValue.toLocaleString()} Mobi
        </h2>
      </div>

      {/* Send Gift Section */}
      <Card className="p-4 sm:p-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold uppercase">
                SEND {userName.split(' ')[0]} A GIFT
              </h3>
              {isOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="pt-6 space-y-4">
            {/* Wallet Balance */}
            <div 
              className="p-4 rounded-lg text-center font-bold"
              style={{ backgroundColor: 'hsl(48, 96%, 89%)' }}
            >
              <span className="text-lg">WALLET BALANCE {walletBalance.toLocaleString()} Mobi</span>
            </div>

            {/* Gift Selector */}
            <div className="space-y-2">
              <Select value={selectedGift} onValueChange={setSelectedGift}>
                <SelectTrigger className="w-full border-primary/50">
                  <SelectValue placeholder="Choose A Gift" />
                </SelectTrigger>
                <SelectContent>
                  {mockGifts.map((gift) => (
                    <SelectItem key={gift.id} value={gift.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{gift.icon}</span>
                        <span>{gift.name}</span>
                        <span className="text-primary font-medium">
                          ({gift.mobiValue.toLocaleString()} Mobi)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Send Button */}
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleSendGift}
                className="px-8"
                style={{ 
                  backgroundColor: 'hsl(189, 94%, 43%)',
                  color: 'hsl(0, 0%, 100%)'
                }}
                size="default"
              >
                <Gift className="mr-2 h-4 w-4" />
                Send Gift
              </Button>
            </div>

            {/* Status Message */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground italic">
                You have not gifted {userName}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Received Gifts List */}
      {mockReceivedGifts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold uppercase text-center">
            GIFTS RECEIVED
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockReceivedGifts.map((gift) => (
              <Card key={`${gift.giftId}-${gift.fromUserId}`} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{gift.icon}</div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold">{gift.giftName}</h4>
                    <p className="text-sm text-primary font-medium">
                      {gift.mobiValue.toLocaleString()} Mobi
                    </p>
                    <p className="text-xs text-muted-foreground">
                      From {gift.fromUserName}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      {new Date(gift.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
