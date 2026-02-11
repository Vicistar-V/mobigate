import { useState } from "react";
import { Zap, Users, Trophy, Radio } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuizMerchant, QuizSeason } from "@/data/mobigateInteractiveQuizData";
import { formatMobiAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";

interface InteractiveQuizSeasonSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchant: QuizMerchant;
  seasons: QuizSeason[];
}

export function InteractiveQuizSeasonSheet({ open, onOpenChange, merchant, seasons }: InteractiveQuizSeasonSheetProps) {
  const { toast } = useToast();
  const [selectedSeason, setSelectedSeason] = useState<QuizSeason | null>(null);

  const handleJoin = () => {
    if (!selectedSeason) return;
    toast({
      title: "🎬 Joined Season!",
      description: `You've joined "${selectedSeason.name}". ${formatMobiAmount(selectedSeason.entryFee)} deducted. Good luck!`,
    });
    onOpenChange(false);
  };

  const getSeasonTypeColor = (type: string) => {
    switch (type) {
      case "Short": return "bg-green-100 text-green-700 border-green-300";
      case "Medium": return "bg-amber-100 text-amber-700 border-amber-300";
      case "Complete": return "bg-purple-100 text-purple-700 border-purple-300";
      default: return "";
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="flex items-center gap-2 text-sm">
            <Trophy className="h-5 w-5 text-blue-500" /> {merchant.name}
          </DrawerTitle>
          <p className="text-xs text-muted-foreground">Select a season to compete in</p>
        </DrawerHeader>

        <ScrollArea className="flex-1 max-h-[60vh] px-4">
          <div className="space-y-3 pb-4">
            {seasons.map((season) => (
              <Card
                key={season.id}
                className={`cursor-pointer transition-all touch-manipulation ${
                  selectedSeason?.id === season.id ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "hover:border-blue-300"
                }`}
                onClick={() => setSelectedSeason(season)}
              >
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold">{season.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`text-[9px] ${getSeasonTypeColor(season.type)}`}>{season.type}</Badge>
                        {season.isLive && (
                          <Badge className="text-[9px] bg-red-500 text-white border-0 animate-pulse">
                            <Radio className="h-2.5 w-2.5 mr-1" /> LIVE
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px]">{season.status}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-1.5 bg-muted/50 rounded text-center">
                      <p className="text-[9px] text-muted-foreground">Levels</p>
                      <p className="font-bold text-xs">{season.selectionLevels}</p>
                    </div>
                    <div className="p-1.5 bg-muted/50 rounded text-center">
                      <p className="text-[9px] text-muted-foreground">Entry</p>
                      <p className="font-bold text-xs text-red-600">{formatMobiAmount(season.entryFee)}</p>
                    </div>
                    <div className="p-1.5 bg-muted/50 rounded text-center">
                      <p className="text-[9px] text-muted-foreground">Prize/Lvl</p>
                      <p className="font-bold text-xs text-green-600">{formatMobiAmount(season.prizePerLevel)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{season.totalParticipants.toLocaleString()} participants</span>
                    <span>Level {season.currentLevel}/{season.selectionLevels}</span>
                  </div>

                  {/* Level progression */}
                  <div className="flex gap-1">
                    {Array.from({ length: season.selectionLevels }).map((_, i) => {
                      const isLive = i >= season.selectionLevels - 3;
                      const isPast = i < season.currentLevel;
                      return (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${
                          isPast ? "bg-blue-500" : isLive ? "bg-red-300" : "bg-muted"
                        }`} />
                      );
                    })}
                  </div>
                  <p className="text-[9px] text-muted-foreground text-center">Last 3 levels are Live Shows 📺</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="px-4 pb-4 pt-2 border-t">
          <Button
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
            onClick={handleJoin}
            disabled={!selectedSeason}
          >
            <Zap className="h-4 w-4 mr-2" />
            {selectedSeason ? `Join - Pay ${formatMobiAmount(selectedSeason.entryFee)}` : "Select a Season"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
