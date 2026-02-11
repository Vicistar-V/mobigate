import { useState } from "react";
import { GraduationCap, Zap, AlertTriangle, Calculator, BookOpen } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockScholarshipTiers, SCHOLARSHIP_STAKE_PERCENTAGE, SCHOLARSHIP_PRIZE_DELAY_DAYS, ScholarshipTier } from "@/data/mobigateScholarshipQuizData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { ScholarshipQuizPlayDialog } from "./ScholarshipQuizPlayDialog";

interface ScholarshipQuizSetupSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScholarshipQuizSetupSheet({ open, onOpenChange }: ScholarshipQuizSetupSheetProps) {
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<ScholarshipTier | null>(null);
  const [customBudget, setCustomBudget] = useState("");
  const [showPlay, setShowPlay] = useState(false);

  const budget = selectedTier ? selectedTier.annualBudget : parseInt(customBudget) || 0;
  const stakeAmount = Math.round(budget * SCHOLARSHIP_STAKE_PERCENTAGE);

  const handleStart = () => {
    if (budget <= 0) {
      toast({ title: "Set Budget", description: "Select a tier or enter a custom budget", variant: "destructive" });
      return;
    }
    toast({ title: "🎓 Scholarship Quiz!", description: `${formatLocalAmount(stakeAmount, "NGN")} deducted.` });
    setShowPlay(true);
  };

  return (
    <>
      <Drawer open={open && !showPlay} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="text-left pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-500" /> Scholarship Quiz
            </DrawerTitle>
            <p className="text-xs text-muted-foreground">Select education tier or enter custom budget</p>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-4 overflow-y-auto touch-auto max-h-[65vh]">
            {/* Preset Tiers */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Education Tiers</h4>
              {mockScholarshipTiers.map((tier) => (
                <Card
                  key={tier.id}
                  className={`cursor-pointer transition-all touch-manipulation ${
                    selectedTier?.id === tier.id ? "border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" : "hover:border-indigo-300"
                  }`}
                  onClick={() => { setSelectedTier(tier); setCustomBudget(""); }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold">{tier.name}</h4>
                      {selectedTier?.id === tier.id && <Badge className="text-[9px] bg-indigo-500 text-white border-0">Selected</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{tier.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/20 rounded text-center">
                        <p className="text-[9px] text-muted-foreground">Budget</p>
                        <p className="font-bold text-xs">{formatMobiAmount(tier.annualBudget)}</p>
                      </div>
                      <div className="p-1.5 bg-red-50 dark:bg-red-950/20 rounded text-center">
                        <p className="text-[9px] text-muted-foreground">Stake (20%)</p>
                        <p className="font-bold text-xs text-red-600">{formatMobiAmount(Math.round(tier.annualBudget * SCHOLARSHIP_STAKE_PERCENTAGE))}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Custom Budget */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Or Enter Custom Budget</h4>
              <Input
                type="number"
                value={customBudget}
                onChange={(e) => { setCustomBudget(e.target.value); setSelectedTier(null); }}
                placeholder="e.g. 500000 (in Mobi)"
                className="h-12 text-base touch-manipulation"
                inputMode="numeric"
                onPointerDown={(e) => e.stopPropagation()}
              />
            </div>

            {budget > 0 && (
              <Card className="border-indigo-200 bg-indigo-50 dark:bg-indigo-950/30">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="h-4 w-4 text-indigo-600" />
                    <h4 className="text-xs font-semibold">Summary</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-white dark:bg-background rounded-lg">
                      <p className="text-[10px] text-muted-foreground">Scholarship</p>
                      <p className="font-bold text-sm">{formatLocalAmount(budget, "NGN")}</p>
                    </div>
                    <div className="p-2 bg-white dark:bg-background rounded-lg">
                      <p className="text-[10px] text-muted-foreground">Your Stake</p>
                      <p className="font-bold text-sm text-red-600">{formatLocalAmount(stakeAmount, "NGN")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-start gap-2 p-2 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 rounded-lg text-[10px]">
              <BookOpen className="h-3 w-3 text-indigo-600 mt-0.5 shrink-0" />
              <p className="text-muted-foreground">
                15 questions (10 objective + 5 typed). 100% correct wins. 70%+ qualifies for bonus. Prize credited after {SCHOLARSHIP_PRIZE_DELAY_DAYS} days. Winners get free Mobi-School access.
              </p>
            </div>
          </div>

          <div className="px-4 pb-4 pt-2 border-t">
            <Button
              className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              onClick={handleStart}
              disabled={budget <= 0}
            >
              <Zap className="h-4 w-4 mr-2" />
              {budget > 0 ? `Play - Stake ${formatMobiAmount(stakeAmount)}` : "Select or Enter Budget"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <ScholarshipQuizPlayDialog
        open={showPlay}
        onOpenChange={(v) => { if (!v) { setShowPlay(false); onOpenChange(false); } }}
        budget={budget}
        stakeAmount={stakeAmount}
      />
    </>
  );
}
