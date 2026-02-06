import { useState } from "react";
import { 
  Clock, 
  Settings, 
  Plus, 
  Pencil, 
  Trash2, 
  Star, 
  Check, 
  X, 
  Shield,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { formatMobiAmount } from "@/lib/campaignFeeDistribution";
import { campaignDurationOptions } from "@/data/campaignSystemData";
import { ModuleAuthorizationDrawer } from "../authorization/ModuleAuthorizationDrawer";

interface EditableDurationOption {
  id: string;
  days: number;
  feeInMobi: number;
  label: string;
  description: string;
  popular: boolean;
}

interface CampaignGlobalSettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignGlobalSettingsDrawer({
  open,
  onOpenChange
}: CampaignGlobalSettingsDrawerProps) {
  const { toast } = useToast();
  
  // Initialize from existing data
  const [durationTiers, setDurationTiers] = useState<EditableDurationOption[]>(
    campaignDurationOptions.map((opt, idx) => ({
      id: `tier-${idx}`,
      days: opt.days,
      feeInMobi: opt.feeInMobi,
      label: opt.label,
      description: opt.description,
      popular: opt.popular || false
    }))
  );
  
  const [editingTier, setEditingTier] = useState<EditableDurationOption | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAuthDrawer, setShowAuthDrawer] = useState(false);
  
  // New tier form state
  const [newTier, setNewTier] = useState({
    days: "",
    feeInMobi: "",
    description: "",
    popular: false
  });

  const handleEditTier = (tier: EditableDurationOption) => {
    setEditingTier({ ...tier });
    setShowAddForm(false);
  };

  const handleSaveEdit = () => {
    if (!editingTier) return;
    
    if (!editingTier.days || editingTier.days < 1) {
      toast({
        title: "Invalid Duration",
        description: "Duration must be at least 1 day",
        variant: "destructive"
      });
      return;
    }
    
    if (!editingTier.feeInMobi || editingTier.feeInMobi < 100) {
      toast({
        title: "Invalid Fee",
        description: "Fee must be at least M100",
        variant: "destructive"
      });
      return;
    }

    setDurationTiers(prev => prev.map(t => 
      t.id === editingTier.id ? editingTier : t
    ));
    setEditingTier(null);
    setHasChanges(true);
    
    toast({
      title: "Tier Updated",
      description: "Changes will be applied after authorization"
    });
  };

  const handleCancelEdit = () => {
    setEditingTier(null);
  };

  const handleDeleteTier = (tierId: string) => {
    if (durationTiers.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "At least one duration tier must remain",
        variant: "destructive"
      });
      return;
    }
    
    setDurationTiers(prev => prev.filter(t => t.id !== tierId));
    setHasChanges(true);
    
    toast({
      title: "Tier Removed",
      description: "Changes will be applied after authorization"
    });
  };

  const handleAddTier = () => {
    const days = parseInt(newTier.days);
    const fee = parseInt(newTier.feeInMobi);
    
    if (!days || days < 1) {
      toast({
        title: "Invalid Duration",
        description: "Please enter a valid number of days",
        variant: "destructive"
      });
      return;
    }
    
    if (!fee || fee < 100) {
      toast({
        title: "Invalid Fee",
        description: "Fee must be at least M100",
        variant: "destructive"
      });
      return;
    }
    
    // Check for duplicate
    if (durationTiers.some(t => t.days === days)) {
      toast({
        title: "Duplicate Duration",
        description: `A ${days}-day tier already exists`,
        variant: "destructive"
      });
      return;
    }
    
    const newOption: EditableDurationOption = {
      id: `tier-${Date.now()}`,
      days,
      feeInMobi: fee,
      label: `${days} Days`,
      description: newTier.description || `${days}-day campaign period`,
      popular: newTier.popular
    };
    
    // Insert in sorted order
    const updated = [...durationTiers, newOption].sort((a, b) => a.days - b.days);
    setDurationTiers(updated);
    setShowAddForm(false);
    setNewTier({ days: "", feeInMobi: "", description: "", popular: false });
    setHasChanges(true);
    
    toast({
      title: "Tier Added",
      description: "Changes will be applied after authorization"
    });
  };

  const handleSubmitChanges = () => {
    setShowAuthDrawer(true);
  };

  const handleAuthComplete = () => {
    toast({
      title: "Configuration Updated",
      description: "Campaign duration and fee settings have been updated successfully"
    });
    setHasChanges(false);
    setShowAuthDrawer(false);
    onOpenChange(false);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] flex flex-col">
          {/* Header */}
          <DrawerHeader className="border-b shrink-0 px-4 py-3">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 shrink-0"
                onClick={() => onOpenChange(false)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <DrawerTitle className="text-base">Campaign Duration & Fees</DrawerTitle>
                  <p className="text-xs text-muted-foreground">Configure pricing tiers</p>
                </div>
              </div>
              <Settings className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          </DrawerHeader>

          {/* Content */}
          <ScrollArea className="flex-1 overflow-y-auto touch-auto">
            <div className="p-4 space-y-4 pb-32">
              {/* Current Tiers */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Current Duration Tiers</h3>
                
                <div className="space-y-2">
                  {durationTiers.map((tier) => (
                    <Card 
                      key={tier.id} 
                      className={editingTier?.id === tier.id ? "ring-2 ring-primary" : ""}
                    >
                      <CardContent className="p-3">
                        {editingTier?.id === tier.id ? (
                          /* Edit Mode */
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Editing: {tier.label}</span>
                              <div className="flex gap-1">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-7 w-7"
                                  onClick={handleCancelEdit}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-7 w-7 text-green-600"
                                  onClick={handleSaveEdit}
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label className="text-xs">Duration (Days) *</Label>
                                <Input
                                  type="number"
                                  value={editingTier.days}
                                  onChange={(e) => setEditingTier(prev => 
                                    prev ? { ...prev, days: parseInt(e.target.value) || 0, label: `${e.target.value} Days` } : null
                                  )}
                                  className="h-9 touch-manipulation"
                                  inputMode="numeric"
                                  autoComplete="off"
                                  autoCorrect="off"
                                  spellCheck={false}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Fee (Mobi) *</Label>
                                <Input
                                  type="number"
                                  value={editingTier.feeInMobi}
                                  onChange={(e) => setEditingTier(prev => 
                                    prev ? { ...prev, feeInMobi: parseInt(e.target.value) || 0 } : null
                                  )}
                                  className="h-9 touch-manipulation"
                                  inputMode="numeric"
                                  autoComplete="off"
                                  autoCorrect="off"
                                  spellCheck={false}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <Label className="text-xs">Description</Label>
                              <Input
                                value={editingTier.description}
                                onChange={(e) => setEditingTier(prev => 
                                  prev ? { ...prev, description: e.target.value } : null
                                )}
                                placeholder="Brief description..."
                                className="h-9 touch-manipulation"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck={false}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Label className="text-xs flex items-center gap-1.5">
                                <Star className="h-3.5 w-3.5 text-amber-500" />
                                Mark as Popular
                              </Label>
                              <Switch
                                checked={editingTier.popular}
                                onCheckedChange={(checked) => setEditingTier(prev => 
                                  prev ? { ...prev, popular: checked } : null
                                )}
                              />
                            </div>
                          </div>
                        ) : (
                          /* Display Mode */
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm">{tier.label}</span>
                                <span className="text-primary font-bold text-sm">
                                  {formatMobiAmount(tier.feeInMobi)}
                                </span>
                                {tier.popular && (
                                  <Badge className="text-[10px] h-4 px-1.5 bg-amber-500">
                                    <Star className="h-2.5 w-2.5 mr-0.5" />
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {tier.description}
                              </p>
                            </div>
                            
                            <div className="flex gap-1 shrink-0">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => handleEditTier(tier)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-destructive"
                                onClick={() => handleDeleteTier(tier.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Add New Tier Section */}
              {showAddForm ? (
                <Card className="border-dashed border-primary/50 bg-primary/5">
                  <CardContent className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Plus className="h-4 w-4 text-primary" />
                        Add New Duration Tier
                      </span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-7 w-7"
                        onClick={() => setShowAddForm(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Duration (Days) *</Label>
                        <Input
                          type="number"
                          value={newTier.days}
                          onChange={(e) => setNewTier(prev => ({ ...prev, days: e.target.value }))}
                          placeholder="e.g., 45"
                          className="h-9 touch-manipulation"
                          inputMode="numeric"
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck={false}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Fee (Mobi) *</Label>
                        <Input
                          type="number"
                          value={newTier.feeInMobi}
                          onChange={(e) => setNewTier(prev => ({ ...prev, feeInMobi: e.target.value }))}
                          placeholder="e.g., 4000"
                          className="h-9 touch-manipulation"
                          inputMode="numeric"
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck={false}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={newTier.description}
                        onChange={(e) => setNewTier(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of this tier..."
                        className="h-9 touch-manipulation"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-xs flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        Mark as Popular
                      </Label>
                      <Switch
                        checked={newTier.popular}
                        onCheckedChange={(checked) => setNewTier(prev => ({ ...prev, popular: checked }))}
                      />
                    </div>
                    
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={handleAddTier}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Tier
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() => {
                    setShowAddForm(true);
                    setEditingTier(null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Duration Tier
                </Button>
              )}

              <Separator />

              {/* Authorization Notice */}
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                <Shield className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-700 dark:text-amber-400">
                  <p className="font-medium">Multi-signature authorization required</p>
                  <p className="mt-0.5">President + Secretary + Legal Adviser must approve changes</p>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-4 bg-background shrink-0">
            <Button
              className="w-full"
              onClick={handleSubmitChanges}
              disabled={!hasChanges}
            >
              <Shield className="h-4 w-4 mr-2" />
              {hasChanges ? "Submit Changes for Authorization" : "No Changes to Submit"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Authorization Drawer */}
      <ModuleAuthorizationDrawer
        open={showAuthDrawer}
        onOpenChange={setShowAuthDrawer}
        module="settings"
        actionTitle="Update Campaign Settings"
        actionDescription="Modify campaign duration tiers and fee structure"
        actionDetails={
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Campaign Duration & Fees</p>
                <p className="text-xs text-muted-foreground">
                  {durationTiers.length} tier{durationTiers.length !== 1 ? 's' : ''} configured
                </p>
              </div>
            </div>
          </div>
        }
        onAuthorized={handleAuthComplete}
      />
    </>
  );
}
