import { useState } from "react";
import { Store, ChevronRight, Star, Users, Trophy } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockMerchants, mockSeasons, QuizMerchant } from "@/data/mobigateInteractiveQuizData";
import { formatMobiAmount } from "@/lib/mobiCurrencyTranslation";
import { InteractiveQuizSeasonSheet } from "./InteractiveQuizSeasonSheet";

interface InteractiveQuizMerchantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InteractiveQuizMerchantSheet({ open, onOpenChange }: InteractiveQuizMerchantSheetProps) {
  const [selectedMerchant, setSelectedMerchant] = useState<QuizMerchant | null>(null);

  return (
    <>
      <Drawer open={open && !selectedMerchant} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="text-left pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" /> Interactive Quiz - Merchants
            </DrawerTitle>
            <p className="text-xs text-muted-foreground">Choose a merchant to explore quiz seasons</p>
          </DrawerHeader>

          <ScrollArea className="flex-1 max-h-[70vh] px-4 pb-4">
            <div className="space-y-3">
              {mockMerchants.map((merchant) => {
                const seasons = mockSeasons.filter(s => s.merchantId === merchant.id);
                return (
                  <Card
                    key={merchant.id}
                    className="cursor-pointer hover:border-blue-300 transition-all touch-manipulation"
                    onClick={() => setSelectedMerchant(merchant)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-lg">
                          <AvatarFallback className="rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">
                            {merchant.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className="text-sm font-bold truncate">{merchant.name}</h4>
                            {merchant.isVerified && <span className="text-blue-500 text-xs">✓</span>}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-[9px]">{merchant.category}</Badge>
                            <span className="text-[10px] text-muted-foreground">{merchant.seasonsAvailable} seasons</span>
                          </div>
                          <p className="text-[10px] text-green-600 mt-1 font-medium">
                            Prize Pool: {formatMobiAmount(merchant.totalPrizePool)}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {selectedMerchant && (
        <InteractiveQuizSeasonSheet
          open={!!selectedMerchant}
          onOpenChange={(v) => { if (!v) { setSelectedMerchant(null); onOpenChange(false); } }}
          merchant={selectedMerchant}
          seasons={mockSeasons.filter(s => s.merchantId === selectedMerchant.id)}
        />
      )}
    </>
  );
}
