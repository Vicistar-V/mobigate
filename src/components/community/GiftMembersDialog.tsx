import { useState } from "react";
import { X, Search, Gift as GiftIcon, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockOnlineMembers, giftCatalog } from "@/data/membershipData";
import { useToast } from "@/hooks/use-toast";

interface GiftMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GiftMembersDialog({ open, onOpenChange }: GiftMembersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredMembers = mockOnlineMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendGift = () => {
    if (!selectedMember || !selectedGift) {
      toast({
        title: "Selection Required",
        description: "Please select both a member and a gift",
        variant: "destructive"
      });
      return;
    }

    const member = mockOnlineMembers.find(m => m.id === selectedMember);
    const gift = giftCatalog.find(g => g.id === selectedGift);

    toast({
      title: "Gift Sent!",
      description: `${gift?.name} sent to ${member?.name}`,
    });

    setSelectedMember(null);
    setSelectedGift(null);
  };

  const virtualGifts = giftCatalog.filter(g => g.category === "virtual");
  const voucherGifts = giftCatalog.filter(g => g.category === "voucher");
  const donationGifts = giftCatalog.filter(g => g.category === "donation");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <GiftIcon className="h-5 w-5 text-primary" />
              Send Gift to Members
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 pt-4 space-y-4">
          {/* Step 1: Select Member */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Step 1: Select Recipient</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-32">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMember(member.id)}
                    className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedMember === member.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-xs font-medium truncate w-full">{member.name}</p>
                      {selectedMember === member.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Step 2: Select Gift */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Step 2: Choose Gift</h3>

            <Tabs defaultValue="virtual">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="virtual" className="text-xs">Virtual</TabsTrigger>
                <TabsTrigger value="voucher" className="text-xs">Vouchers</TabsTrigger>
                <TabsTrigger value="donation" className="text-xs">Donations</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-48 mt-3">
                <TabsContent value="virtual" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {virtualGifts.map((gift) => (
                      <GiftCard
                        key={gift.id}
                        gift={gift}
                        isSelected={selectedGift === gift.id}
                        onSelect={() => setSelectedGift(gift.id)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="voucher" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {voucherGifts.map((gift) => (
                      <GiftCard
                        key={gift.id}
                        gift={gift}
                        isSelected={selectedGift === gift.id}
                        onSelect={() => setSelectedGift(gift.id)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="donation" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {donationGifts.map((gift) => (
                      <GiftCard
                        key={gift.id}
                        gift={gift}
                        isSelected={selectedGift === gift.id}
                        onSelect={() => setSelectedGift(gift.id)}
                      />
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>

          {/* Send Button */}
          <Button 
            className="w-full"
            disabled={!selectedMember || !selectedGift}
            onClick={handleSendGift}
          >
            <GiftIcon className="h-4 w-4 mr-2" />
            Send Gift
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GiftCard({ 
  gift, 
  isSelected, 
  onSelect 
}: { 
  gift: typeof giftCatalog[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Card
      onClick={onSelect}
      className={`cursor-pointer transition-all ${
        isSelected ? "border-2 border-primary shadow-md" : "hover:border-primary/50"
      }`}
    >
      <CardContent className="p-3 text-center">
        <div className="text-3xl mb-2">{gift.icon}</div>
        <p className="font-semibold text-xs mb-1 line-clamp-1">{gift.name}</p>
        <p className="text-xs text-primary font-bold">
          {gift.currency} {gift.price.toLocaleString()}
        </p>
        {isSelected && (
          <Check className="h-4 w-4 text-primary mx-auto mt-2" />
        )}
      </CardContent>
    </Card>
  );
}
