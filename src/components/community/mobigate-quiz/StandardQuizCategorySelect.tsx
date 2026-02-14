import { useState } from "react";
import { ChevronRight, Trophy, Zap } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { PRESET_QUIZ_CATEGORIES, PRESET_LEVEL_TIERS } from "@/data/mobigateQuizLevelsData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { StandardQuizContinueSheet } from "./StandardQuizContinueSheet";

interface StandardQuizCategorySelectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StandardQuizCategorySelect({ open, onOpenChange }: StandardQuizCategorySelectProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"category" | "level">("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<typeof PRESET_LEVEL_TIERS[number] | null>(null);
  const [showPlay, setShowPlay] = useState(false);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setStep("level");
  };

  const handleLevelSelect = (level: typeof PRESET_LEVEL_TIERS[number]) => {
    setSelectedLevel(level);
  };

  const handleStart = () => {
    if (!selectedCategory || !selectedLevel) return;
    toast({ title: "🎯 Game Starting!", description: `${formatLocalAmount(selectedLevel.defaultStake, "NGN")} deducted.` });
    setShowPlay(true);
  };

  const handleReset = () => {
    setStep("category");
    setSelectedCategory(null);
    setSelectedLevel(null);
  };

  return (
    <>
      <Drawer open={open && !showPlay} onOpenChange={(v) => { if (!v) { handleReset(); onOpenChange(false); } }}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="text-left pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              {step === "category" ? "Select Category" : "Select Level"}
            </DrawerTitle>
            {selectedCategory && step === "level" && (
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[10px]">{selectedCategory}</Badge>
                <button onClick={() => setStep("category")} className="text-[10px] text-primary underline">Change</button>
              </div>
            )}
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto touch-auto px-4 pb-4" style={{ maxHeight: "calc(92vh - 140px)" }}>
            {step === "category" && (
              <div className="space-y-2">
                {PRESET_QUIZ_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all touch-manipulation"
                  >
                    <span className="text-sm font-medium text-left">{cat}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {step === "level" && (
              <div className="space-y-2">
                {PRESET_LEVEL_TIERS.map((level) => (
                  <Card
                    key={level.name}
                    className={`cursor-pointer transition-all touch-manipulation ${
                      selectedLevel?.name === level.name ? "border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/30" : "border hover:border-amber-300"
                    }`}
                    onClick={() => handleLevelSelect(level)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold">{level.name}</h4>
                        {selectedLevel?.name === level.name && <Badge className="text-[9px] bg-amber-500 text-white border-0">Selected</Badge>}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded text-center">
                          <p className="text-[10px] text-muted-foreground">Stake</p>
                          <p className="font-bold text-xs text-red-600">{formatMobiAmount(level.defaultStake)}</p>
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded text-center">
                          <p className="text-[10px] text-muted-foreground">Win</p>
                          <p className="font-bold text-xs text-green-600">{formatMobiAmount(level.defaultWinning)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {step === "level" && (
            <div className="px-4 pb-4 pt-2 border-t">
              <Button
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                onClick={handleStart}
                disabled={!selectedLevel}
              >
                <Zap className="h-4 w-4 mr-2" />
                {selectedLevel ? `Play - Stake ${formatMobiAmount(selectedLevel.defaultStake)}` : "Select a Level"}
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      {selectedLevel && selectedCategory && (
        <StandardQuizContinueSheet
          open={showPlay}
          onOpenChange={(v) => {
            if (!v) {
              setShowPlay(false);
              handleReset();
              onOpenChange(false);
            }
          }}
          category={selectedCategory}
          levelName={selectedLevel.name}
          stake={selectedLevel.defaultStake}
          baseWinning={selectedLevel.defaultWinning}
        />
      )}
    </>
  );
}
