import { Card, CardContent } from "@/components/ui/card";
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
  mockReceivedGifts,
  mockSentGifts 
} from "@/data/profileData";
import { useToast } from "@/hooks/use-toast";
import { Gift, Wallet, Heart, User, ExternalLink, ChevronLeft, ChevronDown, Send } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ProfileGiftsTabProps {
  userName: string;
  userId?: string;
}

type GiftSelection = {
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

export const ProfileGiftsTab = ({ userName }: ProfileGiftsTabProps) => {
  const { toast } = useToast();
  const [selectedGift, setSelectedGift] = useState<GiftSelection>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [tangibleGiftTab, setTangibleGiftTab] = useState<"vault" | "buy">("vault");
  const [walletBalance] = useState(50000);
  const [giftHistoryTab, setGiftHistoryTab] = useState<"received" | "sent">("received");
  
  // Collapsible states
  const [specialGiftOpen, setSpecialGiftOpen] = useState(false);
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

    toast({
      title: "Gift Sent! 🎁",
      description: `You sent ${giftData.name} to ${userName}`,
      className: "bg-success/10 border-success",
    });

    // Clear selection
    setSelectedGift(null);
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

  const getValueCategory = (value: number) => {
    if (value <= 100) return { label: "Sweet", color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" };
    if (value <= 1000) return { label: "Special", color: "bg-blue-500/10 text-blue-700 border-blue-500/20" };
    if (value <= 10000) return { label: "Premium", color: "bg-purple-500/10 text-purple-700 border-purple-500/20" };
    return { label: "Luxury", color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" };
  };

  return (
    <div className="space-y-6 pb-6">
      {/* SECTION 1: Send Gift Header */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10">
        <h3 className="text-base font-bold uppercase mb-2">
          SEND {userName.toUpperCase()} A GIFT
        </h3>
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
                {selectedGift.type === 'tangible' && 'Tangible Gift'}
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

      {/* SECTION 2: Select a Special Digital Gift - Folder Structure */}
      <Collapsible open={specialGiftOpen} onOpenChange={setSpecialGiftOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium">Special Digital Gift</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", specialGiftOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4">
              {!selectedFolder ? (
                // Show gift folders
                <ScrollArea className="h-[320px]">
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
                // Show gifts within selected folder
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
                        
                        <ScrollArea className="h-[240px] pr-2">
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

      {/* SECTION 3: Select Classic Digital Gift - LIST VIEW */}
      <Collapsible open={classicGiftOpen} onOpenChange={setClassicGiftOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium">Classic Digital Gift</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", classicGiftOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4">
              <ScrollArea className="h-[320px] pr-2">
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

      {/* SECTION 4: Select Tangible Mobi-store Gift - TABBED */}
      <Collapsible open={tangibleGiftOpen} onOpenChange={setTangibleGiftOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium">Tangible Mobi-Store Gift</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", tangibleGiftOpen && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4">
              <Tabs value={tangibleGiftTab} onValueChange={(v) => setTangibleGiftTab(v as any)}>
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="vault">Gift Vault</TabsTrigger>
                  <TabsTrigger value="buy">Buy Gift Items</TabsTrigger>
                </TabsList>
                
                <TabsContent value="vault" className="mt-0">
                  {giftsVault.length === 0 && (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        No saved gifts in vault
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Save your favorite gifts for quick access
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

      {/* SECTION 5: Send Gift Button */}
      <Button
        onClick={handleSendGift}
        disabled={!selectedGift}
        className="w-full h-12 text-base font-semibold"
      >
        <Gift className="h-5 w-5 mr-2" />
        {selectedGift 
          ? `Send Gift (${selectedGift.giftData.mobiValue.toLocaleString()} Mobi)`
          : 'Send Gift'
        }
      </Button>

      {/* SECTION 6: Mobi-Store Prompt */}
      <Card className="p-4 bg-muted/30 border-dashed">
        <p className="text-sm text-center">
          Please{" "}
          <Button variant="link" className="px-1 h-auto py-0 text-sm font-semibold">
            ENTER MOBI-STORE
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>{" "}
          to shop for more items
        </p>
      </Card>

      {/* SECTION 7: Gift History - Tabbed (Received & Sent) */}
      <Card className="p-4">
        <Tabs value={giftHistoryTab} onValueChange={(v) => setGiftHistoryTab(v as "received" | "sent")}>
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="received" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Received Gifts
              {mockReceivedGifts.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {mockReceivedGifts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Sent Gifts
              {mockSentGifts.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {mockSentGifts.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Received Gifts */}
          <TabsContent value="received" className="mt-0">
            {mockReceivedGifts.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="h-16 w-16 mx-auto mb-3 text-muted-foreground/30" />
                <h4 className="text-base font-semibold mb-2">No Gifts Yet</h4>
                <p className="text-sm text-muted-foreground">
                  {userName} hasn't received any gifts yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mockReceivedGifts.map((gift, index) => {
                  const category = getValueCategory(gift.mobiValue);
                  
                  return (
                    <Card 
                      key={`received-${gift.giftId}-${index}`} 
                      className="p-3 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="text-center space-y-2">
                        <div className="text-4xl mb-2">{gift.icon}</div>
                        <p className="font-bold text-sm line-clamp-1">{gift.giftName}</p>
                        <p className="text-sm font-bold text-primary">
                          {gift.mobiValue.toLocaleString()} Mobi
                        </p>
                        <Badge variant="outline" className={cn("text-xs", category.color)}>
                          {category.label}
                        </Badge>
                        <div className="pt-2 border-t space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              From: {gift.fromUserName}
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
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: Sent Gifts */}
          <TabsContent value="sent" className="mt-0">
            {mockSentGifts.length === 0 ? (
              <div className="text-center py-12">
                <Send className="h-16 w-16 mx-auto mb-3 text-muted-foreground/30" />
                <h4 className="text-base font-semibold mb-2">No Gifts Sent</h4>
                <p className="text-sm text-muted-foreground">
                  You haven't sent any gifts yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mockSentGifts.map((gift, index) => {
                  const category = getValueCategory(gift.mobiValue);
                  
                  return (
                    <Card 
                      key={`sent-${gift.giftId}-${index}`} 
                      className="p-3 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="text-center space-y-2">
                        <div className="text-4xl mb-2">{gift.icon}</div>
                        <p className="font-bold text-sm line-clamp-1">{gift.giftName}</p>
                        <p className="text-sm font-bold text-primary">
                          {gift.mobiValue.toLocaleString()} Mobi
                        </p>
                        <Badge variant="outline" className={cn("text-xs", category.color)}>
                          {category.label}
                        </Badge>
                        <div className="pt-2 border-t space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              To: {gift.toUserName}
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
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
