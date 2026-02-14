import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Save } from "lucide-react";
import { PRESET_QUIZ_CATEGORIES } from "@/data/mobigateQuizLevelsData";
import type { QuizLevelEntry } from "@/data/mobigateQuizLevelsData";

interface EditQuizLevelDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: QuizLevelEntry | null;
  onSave: (id: string, data: { category: string; stakeAmount: number; winningAmount: number; isActive: boolean }) => void;
  onDelete: (id: string) => void;
}

export function EditQuizLevelDrawer({ open, onOpenChange, entry, onSave, onDelete }: EditQuizLevelDrawerProps) {
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [winningAmount, setWinningAmount] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (entry) {
      const isPreset = (PRESET_QUIZ_CATEGORIES as readonly string[]).includes(entry.category);
      setCategory(isPreset ? entry.category : "__custom__");
      setCustomCategory(isPreset ? "" : entry.category);
      setStakeAmount(entry.stakeAmount.toString());
      setWinningAmount(entry.winningAmount.toString());
      setIsActive(entry.isActive);
    }
  }, [entry]);

  if (!entry) return null;

  const isCustom = category === "__custom__";
  const resolvedCategory = isCustom ? customCategory.trim() : category;

  const canSave = resolvedCategory && !isNaN(parseInt(stakeAmount)) && !isNaN(parseInt(winningAmount)) && parseInt(stakeAmount) > 0 && parseInt(winningAmount) > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave(entry.id, {
      category: resolvedCategory,
      stakeAmount: parseInt(stakeAmount),
      winningAmount: parseInt(winningAmount),
      isActive,
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDelete(entry.id);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-base">Edit: {entry.levelName}</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 space-y-4 overflow-y-auto">
          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 text-base touch-manipulation">
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {PRESET_QUIZ_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-sm">{cat}</SelectItem>
                ))}
                <SelectItem value="__custom__" className="text-sm font-medium text-primary">Custom (Specify)</SelectItem>
              </SelectContent>
            </Select>
            {isCustom && (
              <Input
                placeholder="Type custom category name"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="h-12 text-base touch-manipulation"
                style={{ touchAction: "manipulation" }}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                onPointerDown={(e) => e.stopPropagation()}
              />
            )}
          </div>

          {/* Stake */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Minimum Stake Amount (Mobi)</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value.replace(/[^0-9]/g, ""))}
              className="h-12 text-base touch-manipulation"
              style={{ touchAction: "manipulation" }}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              onPointerDown={(e) => e.stopPropagation()}
            />
          </div>

          {/* Winning */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Winning Amount (Mobi)</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={winningAmount}
              onChange={(e) => setWinningAmount(e.target.value.replace(/[^0-9]/g, ""))}
              className="h-12 text-base touch-manipulation"
              style={{ touchAction: "manipulation" }}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              onPointerDown={(e) => e.stopPropagation()}
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-xs text-muted-foreground">{isActive ? "Active" : "Inactive"}</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>

        <DrawerFooter className="pt-3 gap-2">
          <Button onClick={handleSave} disabled={!canSave} className="w-full h-12 text-base font-semibold touch-manipulation">
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={handleDelete} className="w-full h-12 text-base text-destructive hover:bg-destructive/10 touch-manipulation">
            <Trash2 className="h-5 w-5 mr-2" />
            Delete Level
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
