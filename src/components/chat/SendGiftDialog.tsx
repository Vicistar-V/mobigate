import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { 
  specialDigitalGiftFolders,
  classicDigitalGifts, 
  tangibleGifts, 
  giftsVault,
} from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { Gift, Wallet, Heart, ChevronLeft, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type GiftSelection = {
  type: 'special' | 'classic' | 'tangible';
  giftId: string;
  giftData: {
    id: string;
    name: string;
    mobiValue: number;
    icon?: string;
    image?: string;
    category?: string;
    description?: string;
  };
} | null;

interface SendGiftDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  onSendGift: (giftData: GiftSelection) => void;
}

export const SendGiftDialog = ({
  isOpen,
  onClose,
  recipientName,
  onSendGift,
}: SendGiftDialogProps) => {
  const { toast } = useToast();
  const [selectedGift, setSelectedGift] = useState<GiftSelection>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [tangibleGiftTab, setTangibleGiftTab] = useState<"vault" | "buy">("vault");
  const [walletBalance] = useState(50000);
  
  // Collapsible states
  const [specialGiftOpen, setSpecialGiftOpen] = useState(true);
  const [classicGiftOpen, setClassicGiftOpen] = useState(false);
  const [tangibleGiftOpen, setTangibleGiftOpen] = useState(false);

  const handleSendGift = () => {
    if (!selectedGift) {
      toast({
        title: "No Gift Selected",
        description: "Please select a gift to send",
        variant: "destructive",
      });
      return;
    }

    const { giftData } = selectedGift;
    
    if (walletBalance < giftData.mobiValue) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${giftData.mobiValue.toLocaleString()} Mobi. Your wallet balance is ${walletBalance.toLocaleString()} Mobi.`,
        variant: "destructive",
      });
      return;
    }

    onSendGift(selectedGift);
    
    toast({
      title: "Gift Sent! 🎁",
      description: `You sent ${giftData.name} to ${recipientName}`,
    });

    // Reset state and close
    setSelectedGift(null);
    setSelectedFolder(null);
    onClose();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Sweet": "bg-pink-500/10 text-pink-700 border-pink-500/20",
      "Meal-Ticket": "bg-green-500/10 text-green-700 border-green-500/20",
      "Special": "bg-purple-500/10 text-purple-700 border-purple-500/20",
      "Premium": "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
      "T-Fare": "bg-blue-500/10 text-blue-700 border-blue-500/20",
      "Emotion": "bg-red-500/10 text-red-700 border-red-500/20",
      "House": "bg-orange-500/10 text-orange-700 border-orange-500/20",
      "Luxury": "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Gift to {recipientName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Wallet Balance */}
          <Card className="p-3 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-2 text-sm">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Wallet Balance:</span>
              <span className="font-bold text-primary">{walletBalance.toLocaleString()} Mobi</span>
            </div>
          </Card>

          {/* Selection Indicator */}
          {selectedGift && (
            <Card className="p-3 bg-primary/5 border-primary">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Badge variant="default" className="text-xs shrink-0">
                    {selectedGift.type === 'special' && 'Special Digital'}
                    {selectedGift.type === 'classic' && 'Classic Digital'}
                    {selectedGift.type === 'tangible' && 'Tangible Gifts'}
                  </Badge>
                  {selectedGift.giftData.icon && (
                    <span className="text-sm">{selectedGift.giftData.icon}</span>
                  )}
                  {selectedGift.type === 'tangible' && !selectedGift.giftData.icon && (
                    <Gift className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-sm font-medium truncate">
                    {selectedGift.giftData.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {selectedGift.giftData.mobiValue.toLocaleString()} Mobi
                  </span>
                  <Button
                    onClick={() => setSelectedGift(null)}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Special Digital Gifts */}
          <Collapsible open={specialGiftOpen} onOpenChange={setSpecialGiftOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <span className="text-sm font-medium">Special Digital Gifts</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", specialGiftOpen && "rotate-180")} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4">
                  {!selectedFolder ? (
                    <ScrollArea className="h-[280px]">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pr-2">
                        {specialDigitalGiftFolders.map(folder => (
                          <button
                            key={folder.id}
                            onClick={() => setSelectedFolder(folder.id)}
                            className="p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center gap-2 text-center group"
                          >
                            <span className="text-3xl">{folder.icon}</span>
                            <span className="text-xs font-medium group-hover:text-primary transition-colors">
                              {folder.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFolder(null);
                          if (selectedGift?.type === 'special') {
                            setSelectedGift(null);
                          }
                        }}
                        className="mb-2"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Folders
                      </Button>
                      
                      {(() => {
                        const folder = specialDigitalGiftFolders.find(f => f.id === selectedFolder);
                        if (!folder) return null;
                        
                        return (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-3 p-2 bg-muted/50 rounded-lg">
                              <span className="text-2xl">{folder.icon}</span>
                              <span className="font-semibold">{folder.name}</span>
                            </div>
                            
                            <ScrollArea className="h-[200px] pr-2">
                              <div className="space-y-2">
                                {folder.gifts.map(gift => (
                                  <button
                                    key={gift.id}
                                    onClick={() => {
                                      setSelectedGift({
                                        type: 'special',
                                        giftId: gift.id,
                                        giftData: {
                                          id: gift.id,
                                          name: `${folder.name.replace(" Gifts", "")} ${gift.mobiValue.toLocaleString()} Mobi`,
                                          icon: folder.icon,
                                          mobiValue: gift.mobiValue
                                        }
                                      });
                                    }}
                                    className={cn(
                                      "w-full p-3 rounded-lg border-2 transition-all",
                                      "flex items-center justify-between",
                                      "hover:bg-muted/50 hover:shadow-md",
                                      selectedGift?.type === 'special' && selectedGift.giftId === gift.id
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border"
                                    )}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-2xl">{folder.icon}</span>
                                      <span className="font-medium text-sm">
                                        {folder.name.replace(" Gifts", "")} - {gift.mobiValue.toLocaleString()} Mobi
                                      </span>
                                    </div>
                                    {selectedGift?.type === 'special' && selectedGift.giftId === gift.id && (
                                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Classic Digital Gifts */}
          <Collapsible open={classicGiftOpen} onOpenChange={setClassicGiftOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <span className="text-sm font-medium">Classic Digital Gifts</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", classicGiftOpen && "rotate-180")} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4">
                  <ScrollArea className="h-[280px] pr-2">
                    <div className="space-y-2">
                      {classicDigitalGifts.map(gift => (
                        <button
                          key={gift.id}
                          onClick={() => {
                            setSelectedGift({
                              type: 'classic',
                              giftId: gift.id,
                              giftData: gift
                            });
                          }}
                          className={cn(
                            "w-full p-3 rounded-lg border-2 transition-all",
                            "flex items-center justify-between",
                            "hover:bg-muted/50 hover:shadow-md",
                            selectedGift?.type === 'classic' && selectedGift.giftId === gift.id
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{gift.icon}</span>
                            <div className="text-left">
                              <p className="font-medium text-sm">{gift.name}</p>
                              <Badge variant="outline" className={cn("text-xs mt-1", getCategoryColor(gift.category))}>
                                {gift.category}
                              </Badge>
                            </div>
                          </div>
                          <span className="font-bold text-primary text-sm">
                            {gift.mobiValue.toLocaleString()} Mobi
                          </span>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Tangible Mobi-Store Gifts */}
          <Collapsible open={tangibleGiftOpen} onOpenChange={setTangibleGiftOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <span className="text-sm font-medium">Tangible Mobi-Store Gifts</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", tangibleGiftOpen && "rotate-180")} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4">
                  <Tabs value={tangibleGiftTab} onValueChange={(v) => setTangibleGiftTab(v as any)}>
                    <TabsList className="w-full grid grid-cols-2 mb-4">
                      <TabsTrigger value="vault">Gifts Vault</TabsTrigger>
                      <TabsTrigger value="buy">Buy Gifts Items</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="vault" className="mt-0">
                      {giftsVault.length === 0 && (
                        <div className="text-center py-8">
                          <Heart className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">
                            No saved gifts in vault
                          </p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="buy" className="mt-0">
                      <div className="grid grid-cols-2 gap-3">
                        {tangibleGifts.map(gift => (
                          <button
                            key={gift.id}
                            onClick={() => {
                              setSelectedGift({
                                type: 'tangible',
                                giftId: gift.id,
                                giftData: gift
                              });
                            }}
                            className={cn(
                              "border-2 rounded-lg overflow-hidden transition-all hover:shadow-lg",
                              selectedGift?.type === 'tangible' && selectedGift.giftId === gift.id
                                ? "border-primary shadow-md"
                                : "border-border"
                            )}
                          >
                            <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                              <Gift className="h-12 w-12 text-pink-400" />
                            </div>
                            <div className="p-3 text-left bg-card">
                              <p className="font-medium text-sm line-clamp-1">{gift.name}</p>
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {gift.description}
                              </p>
                              <p className="font-bold text-primary text-sm">
                                {gift.mobiValue.toLocaleString()} Mobi
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Send Button */}
          <Button
            onClick={handleSendGift}
            disabled={!selectedGift}
            className="w-full h-11 text-base font-semibold"
          >
            <Gift className="h-5 w-5 mr-2" />
            {selectedGift 
              ? `Send Gift (${selectedGift.giftData.mobiValue.toLocaleString()} Mobi)`
              : 'Send Gift'
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
