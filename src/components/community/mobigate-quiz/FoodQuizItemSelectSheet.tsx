import { useState } from "react";
import { ShoppingCart, Check, Zap, AlertTriangle } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { mockGroceryItems, FOOD_QUIZ_STAKE_PERCENTAGE, GroceryItem } from "@/data/mobigateFoodQuizData";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";
import { useToast } from "@/hooks/use-toast";
import { FoodQuizPlayDialog } from "./FoodQuizPlayDialog";

interface FoodQuizItemSelectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FoodQuizItemSelectSheet({ open, onOpenChange }: FoodQuizItemSelectSheetProps) {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showPlay, setShowPlay] = useState(false);

  const selectedItems = mockGroceryItems.filter(g => selectedIds.includes(g.id));
  const totalValue = selectedItems.reduce((sum, item) => sum + item.marketPrice, 0);
  const stakeAmount = Math.round(totalValue * FOOD_QUIZ_STAKE_PERCENTAGE);

  const toggleItem = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleStart = () => {
    if (selectedIds.length === 0) {
      toast({ title: "Select Items", description: "Select at least one item to play", variant: "destructive" });
      return;
    }
    toast({ title: "🛒 Game Starting!", description: `${formatLocalAmount(stakeAmount, "NGN")} deducted.` });
    setShowPlay(true);
  };

  const categories = [...new Set(mockGroceryItems.map(g => g.category))];

  return (
    <>
      <Drawer open={open && !showPlay} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="text-left pb-2">
            <DrawerTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-500" /> Food for Home Quiz
            </DrawerTitle>
            <p className="text-xs text-muted-foreground">Select grocery items you want to win</p>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4">
            <div className="space-y-4 pb-4">
              {categories.map(cat => (
                <div key={cat}>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">{cat}</h4>
                  <div className="space-y-2">
                    {mockGroceryItems.filter(g => g.category === cat).map(item => {
                      const isSelected = selectedIds.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all touch-manipulation text-left ${
                            isSelected ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-border hover:border-green-300"
                          }`}
                        >
                          <span className="text-xl">{item.image}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">per {item.unit}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold">{formatMobiAmount(item.marketPrice)}</p>
                            <p className="text-[10px] text-muted-foreground">{formatLocalAmount(item.marketPrice, "NGN")}</p>
                          </div>
                          <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${isSelected ? "bg-green-500" : "border-2 border-muted"}`}>
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="px-4 pb-4 pt-3 border-t space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-[10px] text-muted-foreground">Items</p>
                <p className="font-bold text-sm">{selectedIds.length}</p>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <p className="text-[10px] text-muted-foreground">Total Value</p>
                <p className="font-bold text-xs text-green-600">{formatMobiAmount(totalValue)}</p>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-lg">
                <p className="text-[10px] text-muted-foreground">Stake (20%)</p>
                <p className="font-bold text-xs text-red-600">{formatMobiAmount(stakeAmount)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 rounded-lg text-[10px]">
              <AlertTriangle className="h-3 w-3 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-muted-foreground">15 questions (10 objective + 5 typed). 100% correct wins items. 70-80% correct qualifies for bonus questions.</p>
            </div>

            <Button
              className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              onClick={handleStart}
              disabled={selectedIds.length === 0}
            >
              <Zap className="h-4 w-4 mr-2" />
              {selectedIds.length > 0 ? `Play - Stake ${formatMobiAmount(stakeAmount)}` : "Select Items to Play"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      <FoodQuizPlayDialog
        open={showPlay}
        onOpenChange={(v) => { if (!v) { setShowPlay(false); onOpenChange(false); } }}
        selectedItems={selectedItems}
        stakeAmount={stakeAmount}
        totalValue={totalValue}
      />
    </>
  );
}
