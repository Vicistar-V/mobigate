import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockGifts, mockReceivedGifts } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { Gift, Wallet, Heart, User, ChevronDown } from "lucide-react";
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
  const [isReceivedOpen, setIsReceivedOpen] = useState(true);

  const totalGiftsValue = mockReceivedGifts.reduce((sum, gift) => sum + gift.mobiValue, 0);
  const totalGiftsCount = mockReceivedGifts.length;

  const handleSendGift = () => {
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
      title: "Gift Sent! 🎁",
      description: `You sent ${gift.name} to ${userName}`,
      className: "bg-success/10 border-success",
    });
    setSelectedGift("");
  };

  const getValueCategory = (value: number) => {
    if (value <= 100) return { label: "Sweet", color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" };
    if (value <= 1000) return { label: "Special", color: "bg-blue-500/10 text-blue-700 border-blue-500/20" };
    if (value <= 10000) return { label: "Premium", color: "bg-purple-500/10 text-purple-700 border-purple-500/20" };
    return { label: "Luxury", color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" };
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header Stats */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold uppercase">
          GIFTS FOR {userName}
        </h2>
        <p className="text-sm text-primary/80">
          {totalGiftsCount} gift{totalGiftsCount !== 1 ? 's' : ''} received • Total value: {totalGiftsValue.toLocaleString()} Mobi
        </p>
      </div>

      {/* Send Gift Section */}
      <Card className="p-4 space-y-4">
        <h3 className="text-base font-bold uppercase">Send {userName} a Gift</h3>
        
        {/* Minimalist Wallet Balance */}
        <div className="flex items-center gap-2 text-sm">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Balance:</span>
          <span className="font-semibold">{walletBalance} Mobi</span>
        </div>

        {/* Gift Selection Dropdown */}
        <div className="space-y-2">
          <Select value={selectedGift} onValueChange={setSelectedGift}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a gift to send..." />
            </SelectTrigger>
            <SelectContent>
              {mockGifts.map((gift) => {
                const canAfford = walletBalance >= gift.mobiValue;
                const category = getValueCategory(gift.mobiValue);
                
                return (
                  <SelectItem 
                    key={gift.id} 
                    value={gift.id}
                    disabled={!canAfford}
                  >
                    <div className="flex items-center justify-between gap-3 w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{gift.icon}</span>
                        <span>{gift.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${category.color} text-xs`}>
                          {category.label}
                        </Badge>
                        <span className="text-sm font-semibold text-primary">
                          {gift.mobiValue} Mobi
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Send Button */}
        <Button 
          onClick={handleSendGift}
          disabled={!selectedGift}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Gift className="h-4 w-4" />
          Send Gift
        </Button>
      </Card>

      {/* Received Gifts Section - Collapsible */}
      {mockReceivedGifts.length > 0 && (
        <Card>
          <Collapsible open={isReceivedOpen} onOpenChange={setIsReceivedOpen}>
            <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold uppercase">
                  Received Gifts ({totalGiftsCount})
                </h3>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${isReceivedOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="p-4 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockReceivedGifts.map((gift, index) => {
                    const category = getValueCategory(gift.mobiValue);
                    
                    return (
                      <Card 
                        key={`${gift.giftId}-${index}`} 
                        className="p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="flex gap-4">
                          {/* Gift Icon */}
                          <div className="flex-shrink-0">
                            <div className="text-5xl">
                              {gift.icon}
                            </div>
                          </div>

                          {/* Gift Details */}
                          <div className="flex-1 min-w-0 space-y-2">
                            <div>
                              <p className="font-bold text-base">{gift.giftName}</p>
                              <p className="text-lg font-bold text-primary">
                                {gift.mobiValue} Mobi
                              </p>
                            </div>

                            <Badge className={`${category.color} text-xs`}>
                              {category.label}
                            </Badge>

                            {/* Sender Info */}
                            <div className="pt-2 border-t space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="p-1 bg-muted rounded-full">
                                  <User className="h-3 w-3" />
                                </div>
                                <p className="text-xs font-medium text-muted-foreground">
                                  From {gift.fromUserName}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(gift.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Empty State */}
      {mockReceivedGifts.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h3 className="text-lg font-bold mb-2">No Gifts Yet</h3>
          <p className="text-sm text-muted-foreground">
            {userName} hasn't received any gifts yet. Be the first to send one!
          </p>
        </Card>
      )}
    </div>
  );
};
