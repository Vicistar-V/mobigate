import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { audienceOptions } from "@/data/fundraiserData";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo, useEffect } from "react";
import { AudienceExclusionDialog } from "@/components/community/AudienceExclusionDialog";
import { CustomAudienceDialog } from "@/components/community/CustomAudienceDialog";

interface RequestAudienceSectionProps {
  selectedAudience: string[];
  onAudienceChange: (audience: string[]) => void;
  lockedAudiences?: string[];
  onTotalCostChange?: (totalCost: number) => void;
}

export const RequestAudienceSection = ({
  selectedAudience,
  onAudienceChange,
  lockedAudiences = [],
  onTotalCostChange,
}: RequestAudienceSectionProps) => {
  const { toast } = useToast();
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [customAudiences, setCustomAudiences] = useState<
    Array<{ id: string; name: string; memberIds: string[]; createdAt: string }>
  >([]);
  const [showExclusionDialog, setShowExclusionDialog] = useState(false);
  const [exclusionMode, setExclusionMode] = useState<"browse" | "view">("browse");
  const [showAudienceDialog, setShowAudienceDialog] = useState(false);
  const [audienceMode, setAudienceMode] = useState<"create" | "view">("create");
  const [publicExceptEnabled, setPublicExceptEnabled] = useState(false);
  const [customAudienceEnabled, setCustomAudienceEnabled] = useState(false);

  const BASE_COST = 1000;

  const toggleAudience = (audienceId: string) => {
    // Prevent unchecking locked audiences
    if (lockedAudiences.includes(audienceId) && selectedAudience.includes(audienceId)) {
      return;
    }
    if (selectedAudience.includes(audienceId)) {
      onAudienceChange(selectedAudience.filter((id) => id !== audienceId));
    } else {
      onAudienceChange([...selectedAudience, audienceId]);
    }
  };

  // Calculate total extra charge percentage based on selected audiences (excluding locked/base ones)
  const totalExtraCharge = useMemo(() => {
    return audienceOptions
      .filter((opt) => selectedAudience.includes(opt.id) && !lockedAudiences.includes(opt.id))
      .reduce((sum, opt) => sum + (opt.chargePercent || 0), 0);
  }, [selectedAudience, lockedAudiences]);

  // Calculate total cost: base + percentage of base for each extra audience
  const totalCost = useMemo(() => {
    const extraCost = audienceOptions
      .filter((opt) => selectedAudience.includes(opt.id) && !lockedAudiences.includes(opt.id))
      .reduce((sum, opt) => sum + (opt.chargePercent / 100) * BASE_COST, 0);
    return BASE_COST + extraCost;
  }, [selectedAudience, lockedAudiences]);

  // Notify parent of cost changes
  useEffect(() => {
    onTotalCostChange?.(totalCost);
  }, [totalCost, onTotalCostChange]);

  const handleBrowseExclusion = () => {
    setExclusionMode("browse");
    setShowExclusionDialog(true);
  };

  const handleViewExclusion = () => {
    setExclusionMode("view");
    setShowExclusionDialog(true);
  };

  const handleAddAudience = () => {
    setAudienceMode("create");
    setShowAudienceDialog(true);
  };

  const handleViewNewList = () => {
    setAudienceMode("view");
    setShowAudienceDialog(true);
  };

  const handleSave = () => {
    toast({
      title: "Audience Saved",
      description: `Your audience selection has been saved. Total cost: ${totalCost} Mobi`,
    });
  };

  return (
    <>
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-bold mb-4 text-center">
          REQUEST AUDIENCE
        </h3>
      
        <div className="space-y-4">
          {/* CHANNELED TO Section */}
          <div>
            <p className="font-semibold mb-3 text-sm">CHANNELED TO:</p>
            <div className="space-y-3">
              {audienceOptions.map((option) => {
                const isLocked = lockedAudiences.includes(option.id);
                return (
                  <div key={option.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Checkbox
                        checked={selectedAudience.includes(option.id)}
                        onCheckedChange={() => toggleAudience(option.id)}
                        disabled={isLocked}
                        className={`shrink-0 ${isLocked ? "opacity-70" : ""}`}
                      />
                      <span className="text-sm font-medium break-words leading-tight">
                        {option.label}
                        {isLocked && (
                          <span className="text-xs text-muted-foreground ml-1">(Base)</span>
                        )}
                      </span>
                    </div>
                    <Badge 
                      variant={option.chargePercent === 0 && isLocked ? "secondary" : "outline"}
                      className={`shrink-0 text-xs ${
                        option.chargePercent === 0 && isLocked
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                          : option.chargePercent === 0
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "text-amber-600 border-amber-300 dark:text-amber-400"
                      }`}
                    >
                      {option.chargePercent === 0 ? "Included" : `+${option.chargePercent}%`}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total Cost Summary */}
          <div className="bg-muted/50 rounded-lg p-3 border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Total Cost:
              </span>
              <span className={`text-lg font-bold ${
                totalExtraCharge === 0 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-amber-600 dark:text-amber-400"
              }`}>
                {totalCost} Mobi
              </span>
            </div>
            {totalExtraCharge > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Base: {BASE_COST} + Extra: {totalCost - BASE_COST} Mobi ({totalExtraCharge}% of base)
              </p>
            )}
          </div>

          {/* PUBLIC EXCEPT Section */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-3 mb-2">
              <Checkbox 
                checked={publicExceptEnabled}
                onCheckedChange={(checked) => setPublicExceptEnabled(checked as boolean)}
                className="shrink-0"
              />
              <span className="text-sm font-semibold">PUBLIC EXCEPT:</span>
            </div>
            <div className="flex flex-wrap gap-2 pl-7">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBrowseExclusion}
                className="h-10"
              >
                Browse
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewExclusion}
                className="h-10"
              >
                View Exclusion List
              </Button>
            </div>
          </div>

          {/* ADD ANOTHER AUDIENCE Section */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-3 mb-2">
              <Checkbox 
                checked={customAudienceEnabled}
                onCheckedChange={(checked) => setCustomAudienceEnabled(checked as boolean)}
                className="shrink-0"
              />
              <span className="text-sm font-semibold">ADD ANOTHER AUDIENCE:</span>
            </div>
            <div className="flex flex-wrap gap-2 pl-7">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAudience}
                className="h-10"
              >
                Browse
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewNewList}
                className="h-10"
              >
                View New List
              </Button>
            </div>
          </div>

          {/* SAVE Button */}
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold mt-6 h-12 text-base"
            onClick={handleSave}
          >
            SAVE
          </Button>
        </div>
      </Card>

      <AudienceExclusionDialog
        open={showExclusionDialog}
        onOpenChange={setShowExclusionDialog}
        mode={exclusionMode}
        excludedIds={excludedIds}
        onExcludedIdsChange={setExcludedIds}
      />

      <CustomAudienceDialog
        open={showAudienceDialog}
        onOpenChange={setShowAudienceDialog}
        mode={audienceMode}
        audiences={customAudiences}
        onAudiencesChange={setCustomAudiences}
      />
    </>
  );
};
