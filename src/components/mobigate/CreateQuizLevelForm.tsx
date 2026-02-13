import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [customLevel, setCustomLevel] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [winningAmount, setWinningAmount] = useState("");
  const [isActive, setIsActive] = useState(true);

  const isAllCategories = selectedCategory === "__all__";
  const isCustomCategory = selectedCategory === "__custom__";
  const isCustomLevel = selectedLevel === "__custom__";

  // Auto-fill stake/winning when a preset level is selected
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
    const category = isCustomCategory ? customCategory.trim() : selectedCategory;
    const levelName = isCustomLevel ? customLevel.trim() : selectedLevel;
    const stake = parseInt(stakeAmount);
    const winning = parseInt(winningAmount);

    if ((!category && !isAllCategories) || !levelName || isNaN(stake) || isNaN(winning) || stake <= 0 || winning <= 0) return;

    if (isAllCategories) {
      // Batch create for all preset categories
      PRESET_QUIZ_CATEGORIES.forEach((cat) => {
        onCreateLevel({ category: cat, levelName, stakeAmount: stake, winningAmount: winning, isActive });
      });
    } else {
      onCreateLevel({ category, levelName, stakeAmount: stake, winningAmount: winning, isActive });
    }

    // Reset
    setSelectedCategory("");
    setCustomCategory("");
    setSelectedLevel("");
    setCustomLevel("");
    setStakeAmount("");
    setWinningAmount("");
    setIsActive(true);
  };

  const canSubmit = () => {
    const category = isAllCategories ? "__all__" : (isCustomCategory ? customCategory.trim() : selectedCategory);
    const levelName = isCustomLevel ? customLevel.trim() : selectedLevel;
    const stake = parseInt(stakeAmount);
    const winning = parseInt(winningAmount);
    return category && levelName && !isNaN(stake) && !isNaN(winning) && stake > 0 && winning > 0;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Create New Quiz Level
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Select Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-12 text-base touch-manipulation">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="__all__" className="text-sm font-bold text-emerald-600">
                ✅ All Categories (23)
              </SelectItem>
              {PRESET_QUIZ_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-sm">
                  {cat}
                </SelectItem>
              ))}
              <SelectItem value="__custom__" className="text-sm font-medium text-primary">
                Custom (Specify)
              </SelectItem>
            </SelectContent>
          </Select>
          {isAllCategories && (
            <div className="flex items-start gap-1.5 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-md">
              <span>This will create the selected level for all 23 preset categories at once.</span>
            </div>
          )}
          {isCustomCategory && (
            <Input
              placeholder="Type custom category name"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="h-12 text-base touch-manipulation"
            />
          )}
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
