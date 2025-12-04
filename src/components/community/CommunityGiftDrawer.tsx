import { useState } from "react";
import { Search, Gift, ChevronLeft, Wallet, Check, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { mockOnlineMembers, Member } from "@/data/membershipData";
import {
  specialDigitalGiftFolders,
  classicDigitalGifts,
  tangibleGifts,
  giftsVault,
  SpecialDigitalGiftFolder,
  SpecialDigitalGiftValue,
  ClassicDigitalGift,
  TangibleGift,
} from "@/data/profileData";

interface CommunityGiftDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type GiftType = "special" | "classic" | "tangible";

interface GiftSelection {
  type: GiftType;
  id: string;
  name: string;
  icon: string;
  mobiValue: number;
}

export function CommunityGiftDrawer({ open, onOpenChange }: CommunityGiftDrawerProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedGift, setSelectedGift] = useState<GiftSelection | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<SpecialDigitalGiftFolder | null>(null);
  const [tangibleTab, setTangibleTab] = useState<"vault" | "buy">("buy");
  
  // Collapsible states
  const [specialOpen, setSpecialOpen] = useState(true);
  const [classicOpen, setClassicOpen] = useState(false);
  const [tangibleOpen, setTangibleOpen] = useState(false);

  // Mock wallet balance
  const walletBalance = 12500;

  const filteredMembers = mockOnlineMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Sweet": "bg-pink-500/10 text-pink-600 border-pink-200",
      "Meal-Ticket": "bg-orange-500/10 text-orange-600 border-orange-200",
      "Special": "bg-purple-500/10 text-purple-600 border-purple-200",
      "Emotion": "bg-red-500/10 text-red-600 border-red-200",
      "Premium": "bg-amber-500/10 text-amber-600 border-amber-200",
      "House": "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      "T-Fare": "bg-blue-500/10 text-blue-600 border-blue-200",
      "Luxury": "bg-indigo-500/10 text-indigo-600 border-indigo-200",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  const handleSelectSpecialGift = (folder: SpecialDigitalGiftFolder, gift: SpecialDigitalGiftValue) => {
    setSelectedGift({
      type: "special",
      id: gift.id,
      name: folder.name,
      icon: folder.icon,
      mobiValue: gift.mobiValue,
    });
  };

  const handleSelectClassicGift = (gift: ClassicDigitalGift) => {
    setSelectedGift({
      type: "classic",
      id: gift.id,
      name: gift.name,
      icon: gift.icon,
      mobiValue: gift.mobiValue,
    });
  };

  const handleSelectTangibleGift = (gift: TangibleGift) => {
    setSelectedGift({
      type: "tangible",
      id: gift.id,
      name: gift.name,
      icon: "🎁",
      mobiValue: gift.mobiValue,
    });
  };

  const handleSendGift = () => {
    if (!selectedMember || !selectedGift) {
      toast({
        title: "Selection Required",
        description: "Please select both a member and a gift",
        variant: "destructive",
      });
      return;
    }

    if (selectedGift.mobiValue > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Your wallet balance is insufficient for this gift",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Gift Sent!",
      description: `${selectedGift.icon} ${selectedGift.name} (${selectedGift.mobiValue.toLocaleString()} Mobi) sent to ${selectedMember.name}`,
    });

    // Reset and close
    setSelectedMember(null);
    setSelectedGift(null);
    setSelectedFolder(null);
    setSearchQuery("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedMember(null);
    setSelectedGift(null);
    setSelectedFolder(null);
    setSearchQuery("");
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[90vh] max-h-[90vh]">
        <DrawerHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <DrawerTitle className="text-lg">Gift Community Members</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}>
                ✕
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 h-[calc(90vh-180px)]">
          <div className="p-4 space-y-5">
            {/* Wallet Balance */}
            <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Wallet Balance</span>
              </div>
              <span className="text-lg font-bold text-primary">
                {walletBalance.toLocaleString()} Mobi
              </span>
            </div>

            {/* Step 1: Select Recipient */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Step 1: Select Recipient
              </h3>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <ScrollArea className="w-full">
                <div className="flex gap-3 pb-2">
                  {filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all min-w-[72px] ${
                        selectedMember?.id === member.id
                          ? "bg-primary/10 ring-2 ring-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-background">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                        )}
                        {selectedMember?.id === member.id && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-center line-clamp-2 max-w-[68px]">
                        {member.name.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </ScrollArea>

              {selectedMember && (
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg animate-fade-in">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedMember.avatar} />
                    <AvatarFallback>{selectedMember.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    Sending to: <span className="text-primary">{selectedMember.name}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Step 2: Choose Gift */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Step 2: Choose Gift
              </h3>

              {/* Selected Gift Preview */}
              {selectedGift && (
                <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedGift.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{selectedGift.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{selectedGift.type} Gift</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-bold">
                    {selectedGift.mobiValue.toLocaleString()} Mobi
                  </Badge>
                </div>
              )}

              {/* Special Digital Gifts */}
              <Collapsible open={specialOpen} onOpenChange={setSpecialOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-11">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">✨</span>
                      Special Digital Gifts
                    </span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${specialOpen ? "rotate-90" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 animate-fade-in">
                  {selectedFolder ? (
                    <div className="space-y-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFolder(null)}
                        className="gap-1 h-8"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Folders
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedFolder.gifts.map((gift) => (
                          <button
                            key={gift.id}
                            onClick={() => handleSelectSpecialGift(selectedFolder, gift)}
                            className={`p-3 rounded-lg border text-center transition-all ${
                              selectedGift?.id === gift.id
                                ? "border-primary bg-primary/10 ring-1 ring-primary"
                                : "border-border hover:border-primary/50 hover:bg-muted"
                            }`}
                          >
                            <span className="text-2xl block mb-1">{selectedFolder.icon}</span>
                            <p className="text-xs font-medium">{selectedFolder.name.replace(" Gifts", "")}</p>
                            <p className="text-sm font-bold text-primary">
                              {gift.mobiValue.toLocaleString()} Mobi
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {specialDigitalGiftFolders.map((folder) => (
                        <button
                          key={folder.id}
                          onClick={() => setSelectedFolder(folder)}
                          className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted transition-all text-center"
                        >
                          <span className="text-2xl block mb-1">{folder.icon}</span>
                          <p className="text-xs font-medium line-clamp-2">{folder.name}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>

              {/* Classic Digital Gifts */}
              <Collapsible open={classicOpen} onOpenChange={setClassicOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-11">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🎁</span>
                      Classic Digital Gifts
                    </span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${classicOpen ? "rotate-90" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 animate-fade-in">
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {classicDigitalGifts.map((gift) => (
                      <button
                        key={gift.id}
                        onClick={() => handleSelectClassicGift(gift)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                          selectedGift?.id === gift.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{gift.icon}</span>
                          <div className="text-left">
                            <p className="text-sm font-medium">{gift.name}</p>
                            <Badge variant="outline" className={`text-xs ${getCategoryColor(gift.category)}`}>
                              {gift.category}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {gift.mobiValue.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Tangible Mobi-Store Gifts */}
              <Collapsible open={tangibleOpen} onOpenChange={setTangibleOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-11">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🛍️</span>
                      Tangible Mobi-Store Gifts
                    </span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${tangibleOpen ? "rotate-90" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 animate-fade-in">
                  <Tabs value={tangibleTab} onValueChange={(v) => setTangibleTab(v as "vault" | "buy")}>
                    <TabsList className="w-full grid grid-cols-2 mb-3">
                      <TabsTrigger value="vault">Gifts Vault</TabsTrigger>
                      <TabsTrigger value="buy">Buy Gifts</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="vault" className="mt-0">
                      {giftsVault.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          <p className="text-sm">No items in your vault</p>
                          <p className="text-xs mt-1">Purchase gifts to add them here</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {giftsVault.map((gift) => (
                            <button
                              key={gift.id}
                              onClick={() => handleSelectTangibleGift(gift)}
                              className={`p-3 rounded-lg border text-center transition-all ${
                                selectedGift?.id === gift.id
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <img
                                src={gift.image}
                                alt={gift.name}
                                className="w-12 h-12 mx-auto mb-2 rounded object-cover"
                              />
                              <p className="text-xs font-medium line-clamp-1">{gift.name}</p>
                              <p className="text-xs font-bold text-primary">
                                {gift.mobiValue.toLocaleString()} Mobi
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="buy" className="mt-0">
                      <div className="grid grid-cols-2 gap-2">
                        {tangibleGifts.map((gift) => (
                          <button
                            key={gift.id}
                            onClick={() => handleSelectTangibleGift(gift)}
                            className={`p-3 rounded-lg border text-center transition-all ${
                              selectedGift?.id === gift.id
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <img
                              src={gift.image}
                              alt={gift.name}
                              className="w-12 h-12 mx-auto mb-2 rounded object-cover"
                            />
                            <p className="text-xs font-medium line-clamp-1">{gift.name}</p>
                            <Badge variant="outline" className="text-xs mb-1">
                              {gift.category}
                            </Badge>
                            <p className="text-xs font-bold text-primary">
                              {gift.mobiValue.toLocaleString()} Mobi
                            </p>
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </ScrollArea>

        {/* Send Button */}
        <div className="p-4 border-t bg-background">
          <Button
            onClick={handleSendGift}
            disabled={!selectedMember || !selectedGift}
            className="w-full h-12 text-base font-semibold"
          >
            {selectedGift ? (
              <>
                Send Gift to {selectedMember?.name.split(" ")[0] || "Member"}
                <Badge variant="secondary" className="ml-2">
                  {selectedGift.mobiValue.toLocaleString()} Mobi
                </Badge>
              </>
            ) : (
              "Select a Gift to Send"
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
