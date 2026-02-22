import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, AlertTriangle } from "lucide-react";
import { PRESET_QUIZ_CATEGORIES, PRESET_LEVEL_TIERS } from "@/data/mobigateQuizLevelsData";

interface CreateQuizLevelFormProps {
  onCreateLevel: (data: {
    category: string;
    levelName: string;
    stakeAmount: number;
    winningAmount: number;
    isActive: boolean;
  }) => void;
}

export function CreateQuizLevelForm({ onCreateLevel }: CreateQuizLevelFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [customLevel, setCustomLevel] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [winningAmount, setWinningAmount] = useState("");
  const [isActive, setIsActive] = useState(true);

  const allPresetsSelected = PRESET_QUIZ_CATEGORIES.every(c => selectedCategories.includes(c));
  const isCustomLevel = selectedLevel === "__custom__";

  const toggleCategory = (cat: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, cat]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== cat));
    }
  };

  const toggleAllCategories = (checked: boolean) => {
    if (checked) {
      setSelectedCategories([...PRESET_QUIZ_CATEGORIES]);
    } else {
      setSelectedCategories([]);
    }
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    if (value !== "__custom__") {
      const tier = PRESET_LEVEL_TIERS.find((t) => t.name === value);
      if (tier) {
        setStakeAmount(tier.defaultStake.toString());
        setWinningAmount(tier.defaultWinning.toString());
      }
    }
  };

  const handleSubmit = () => {
    const levelName = isCustomLevel ? customLevel.trim() : selectedLevel;
    const stake = parseInt(stakeAmount);
    const winning = parseInt(winningAmount);

    if (!levelName || isNaN(stake) || isNaN(winning) || stake <= 0 || winning <= 0) return;

    // Collect all categories to create for
    const categoriesToCreate: string[] = [...selectedCategories];
    if (showCustomCategory && customCategory.trim()) {
      categoriesToCreate.push(customCategory.trim());
    }

    if (categoriesToCreate.length === 0) return;

    categoriesToCreate.forEach((cat) => {
      onCreateLevel({ category: cat, levelName, stakeAmount: stake, winningAmount: winning, isActive });
    });

    // Reset
    setSelectedCategories([]);
    setShowCustomCategory(false);
    setCustomCategory("");
    setSelectedLevel("");
    setCustomLevel("");
    setStakeAmount("");
    setWinningAmount("");
    setIsActive(true);
  };

  const canSubmit = () => {
    const hasCategories = selectedCategories.length > 0 || (showCustomCategory && customCategory.trim());
    const levelName = isCustomLevel ? customLevel.trim() : selectedLevel;
    const stake = parseInt(stakeAmount);
    const winning = parseInt(winningAmount);
    return hasCategories && levelName && !isNaN(stake) && !isNaN(winning) && stake > 0 && winning > 0;
  };

  const totalSelected = selectedCategories.length + (showCustomCategory && customCategory.trim() ? 1 : 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Create New Quiz Level
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Multi-Select */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Select Categories</Label>
            {selectedCategories.length > 0 && (
              <button
                type="button"
                className="text-[11px] text-destructive font-medium touch-manipulation active:scale-[0.97] px-2 py-0.5 rounded"
                onClick={() => setSelectedCategories([])}
              >
                Deselect All
              </button>
            )}
          </div>
          <div className="border border-border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto touch-auto">
            {/* All Categories toggle */}
            <label className="flex items-center gap-2.5 py-1 cursor-pointer touch-manipulation min-h-[44px]">
              <Checkbox
                checked={allPresetsSelected}
                onCheckedChange={(checked) => toggleAllCategories(!!checked)}
              />
              <span className="text-sm font-medium">All Categories ({PRESET_QUIZ_CATEGORIES.length})</span>
            </label>
            <div className="border-t border-border/40" />
            {PRESET_QUIZ_CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2.5 py-1 cursor-pointer touch-manipulation min-h-[44px]">
                <Checkbox
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={(checked) => toggleCategory(cat, !!checked)}
                />
                <span className="text-sm">{cat}</span>
              </label>
            ))}
            <div className="border-t border-border/40" />
            {/* Custom category checkbox */}
            <label className="flex items-center gap-2.5 py-1 cursor-pointer touch-manipulation min-h-[44px]">
              <Checkbox
                checked={showCustomCategory}
                onCheckedChange={(checked) => setShowCustomCategory(!!checked)}
              />
              <span className="text-sm font-medium text-primary">Custom (Specify)</span>
            </label>
          </div>
          {showCustomCategory && (
            <Input
              placeholder="Type custom category name"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="h-12 text-base touch-manipulation"
            />
          )}
          <p className="text-[10px] text-muted-foreground">
            {totalSelected > 0
              ? `${totalSelected} categor${totalSelected === 1 ? "y" : "ies"} selected — level will be created for each.`
              : "Select at least one category."}
          </p>
        </div>

        {/* Level */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Select Level</Label>
          <Select value={selectedLevel} onValueChange={handleLevelChange}>
            <SelectTrigger className="h-12 text-base touch-manipulation">
              <SelectValue placeholder="Choose a level tier" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {PRESET_LEVEL_TIERS.map((tier) => (
                <SelectItem key={tier.name} value={tier.name} className="text-sm">
                  {tier.name}
                </SelectItem>
              ))}
              <SelectItem value="__custom__" className="text-sm font-medium text-primary">
                Custom (Specify)
              </SelectItem>
            </SelectContent>
          </Select>
          {isCustomLevel && (
            <>
              <Input
                placeholder="Type custom level name"
                value={customLevel}
                onChange={(e) => setCustomLevel(e.target.value)}
                className="h-12 text-base touch-manipulation"
              />
              <div className="flex items-start gap-1.5 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md">
                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>Avoid special characters and symbols like &amp;, use 'and' instead. This feature is not editable in future.</span>
              </div>
            </>
          )}
        </div>

        {/* Stake Amount */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Minimum Stake Amount (Mobi)</Label>
          <Input
            type="number"
            placeholder="e.g. 500 (Do not put comma)"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            className="h-12 text-base touch-manipulation"
          />
        </div>

        {/* Winning Amount */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Winning Amount (Mobi)</Label>
          <Input
            type="number"
            placeholder="e.g. 1000 (Do not put comma)"
            value={winningAmount}
            onChange={(e) => setWinningAmount(e.target.value)}
            className="h-12 text-base touch-manipulation"
          />
        </div>

        {/* Status Toggle */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="text-xs text-muted-foreground">{isActive ? "Active" : "Inactive"}</p>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>

        {/* Create Button */}
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className="w-full h-12 text-base font-semibold touch-manipulation"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Quiz Level
        </Button>
      </CardContent>
    </Card>
  );
}
