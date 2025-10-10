import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockGifts, mockReceivedGifts } from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { Gift, Wallet, Sparkles, Heart, User } from "lucide-react";
import { useState } from "react";

interface ProfileGiftsTabProps {
  userName: string;
  userId?: string;
}

export const ProfileGiftsTab = ({ userName }: ProfileGiftsTabProps) => {
  const { toast } = useToast();
  const [selectedGift, setSelectedGift] = useState<string>("");
  const [walletBalance] = useState(1);

  const totalGiftsValue = mockReceivedGifts.reduce((sum, gift) => sum + gift.mobiValue, 0);
  const totalGiftsCount = mockReceivedGifts.length;

  const handleSelectGift = (giftId: string) => {
    setSelectedGift(giftId);
  };

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
      <Card className="p-6 space-y-6">
        {/* Wallet Balance */}
        <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/20 rounded-lg">
              <Wallet className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-warning">Your Wallet Balance</p>
              <p className="text-2xl font-bold">{walletBalance} Mobi</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-warning text-warning hover:bg-warning/10">
            Top Up
          </Button>
        </div>

        {/* Gift Selection Header */}
        <div>
          <h3 className="text-base font-bold uppercase mb-2">Choose a Gift to Send</h3>
          <p className="text-sm text-muted-foreground">
            {selectedGift ? "Click Send Gift below to complete" : "Select a gift from the collection"}
          </p>
        </div>

        {/* Gift Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {mockGifts.map((gift) => {
            const isSelected = selectedGift === gift.id;
            const category = getValueCategory(gift.mobiValue);
            const canAfford = walletBalance >= gift.mobiValue;
            
            return (
              <button
                key={gift.id}
                onClick={() => canAfford && handleSelectGift(gift.id)}
                disabled={!canAfford}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-primary bg-primary/5 shadow-lg scale-105 ring-2 ring-primary/20' 
                    : canAfford
                      ? 'border-border hover:border-primary/50 hover:shadow-md hover:scale-105 bg-card'
                      : 'border-border opacity-40 cursor-not-allowed bg-muted'
                  }
                `}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Sparkles className="h-3 w-3" />
                  </div>
                )}

                {/* Gift Icon */}
                <div className="text-5xl mb-3 transition-transform group-hover:scale-110">
                  {gift.icon}
                </div>

                {/* Gift Name */}
                <p className="text-sm font-semibold mb-2 line-clamp-1">
                  {gift.name}
                </p>

                {/* Value & Category */}
                <div className="space-y-2">
                  <p className="text-lg font-bold text-primary">
                    {gift.mobiValue} Mobi
                  </p>
                  <Badge className={`${category.color} text-xs`}>
                    {category.label}
                  </Badge>
                </div>

                {!canAfford && (
                  <p className="text-xs text-destructive mt-2">
                    Insufficient funds
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Send Button */}
        {selectedGift && (
          <Button 
            onClick={handleSendGift}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold"
            size="lg"
          >
            <Gift className="h-5 w-5" />
            Send Gift to {userName}
          </Button>
        )}
      </Card>

      {/* Received Gifts Section */}
      {mockReceivedGifts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold uppercase">Received Gifts</h3>
          </div>
          
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
