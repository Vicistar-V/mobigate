import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModuleAuthorizationDrawer } from "@/components/admin/authorization/ModuleAuthorizationDrawer";
import { 
  Settings, 
  Vote, 
  Users, 
  Clock, 
  Calendar,
  ShieldCheck,
  Eye,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  Timer,
  Percent,
  Lock,
  Save,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ElectionSetting {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: React.ElementType;
  currentValue: string;
  options: { value: string; label: string; description?: string }[];
  requiresMultiSig: boolean;
  lastUpdated: Date;
  hasPendingChange: boolean;
}

const electionSettingsData: ElectionSetting[] = [
  {
    id: "voting-eligibility",
    key: "voting_eligibility",
    name: "Voting Eligibility",
    description: "Who can vote in elections",
    icon: UserCheck,
    currentValue: "financial_members",
    options: [
      { value: "all_members", label: "All Members", description: "Any registered member" },
      { value: "valid_members", label: "Valid Members", description: "Active, non-suspended" },
      { value: "financial_members", label: "Financial Members", description: "Dues up-to-date" },
    ],
    requiresMultiSig: true,
    lastUpdated: new Date("2024-08-01"),
    hasPendingChange: false,
  },
  {
    id: "candidate-eligibility",
    key: "candidate_eligibility",
    name: "Candidate Eligibility Period",
    description: "Minimum membership duration to run for office",
    icon: Calendar,
    currentValue: "2_years",
    options: [
      { value: "6_months", label: "6 Months" },
      { value: "1_year", label: "1 Year" },
      { value: "2_years", label: "2 Years" },
      { value: "3_years", label: "3 Years" },
      { value: "5_years", label: "5 Years" },
    ],
    requiresMultiSig: true,
    lastUpdated: new Date("2024-07-15"),
    hasPendingChange: false,
  },
  {
    id: "voting-period",
    key: "voting_period",
    name: "Voting Period Duration",
    description: "How long voting remains open",
    icon: Clock,
    currentValue: "3_days",
    options: [
      { value: "1_day", label: "1 Day" },
      { value: "3_days", label: "3 Days" },
      { value: "5_days", label: "5 Days" },
      { value: "7_days", label: "7 Days" },
      { value: "14_days", label: "14 Days" },
    ],
    requiresMultiSig: true,
    lastUpdated: new Date("2025-01-05"),
    hasPendingChange: true,
  },
  {
    id: "vote-change-window",
    key: "vote_change_window",
    name: "Vote Change Window",
    description: "Time allowed to change vote after casting",
    icon: Timer,
    currentValue: "30_mins",
    options: [
      { value: "none", label: "No Changes", description: "Votes are final" },
      { value: "15_mins", label: "15 Minutes" },
      { value: "30_mins", label: "30 Minutes" },
      { value: "1_hour", label: "1 Hour" },
      { value: "24_hours", label: "24 Hours" },
    ],
    requiresMultiSig: true,
    lastUpdated: new Date("2024-12-01"),
    hasPendingChange: false,
  },
  {
    id: "primary-threshold",
    key: "primary_threshold",
    name: "Primary Election Threshold",
    description: "Minimum percentage to advance from primary",
    icon: Percent,
    currentValue: "25_percent",
    options: [
      { value: "15_percent", label: "15%" },
      { value: "20_percent", label: "20%" },
      { value: "25_percent", label: "25%" },
      { value: "30_percent", label: "30%" },
    ],
    requiresMultiSig: true,
    lastUpdated: new Date("2024-11-01"),
    hasPendingChange: false,
  },
  {
    id: "results-visibility",
    key: "results_visibility",
    name: "Results Visibility",
    description: "Who can view detailed election results",
    icon: Eye,
    currentValue: "all_members",
    options: [
      { value: "admins_only", label: "Admins Only" },
      { value: "valid_members", label: "Valid Members" },
      { value: "all_members", label: "All Members" },
    ],
    requiresMultiSig: true,
    lastUpdated: new Date("2024-10-15"),
    hasPendingChange: false,
  },
  {
    id: "voter-transparency",
    key: "voter_transparency",
    name: "Voter Transparency",
    description: "Whether voter identities are visible to admins",
    icon: ShieldCheck,
    currentValue: "anonymous",
    options: [
      { value: "anonymous", label: "Anonymous", description: "Show accreditation numbers only" },
      { value: "identified", label: "Identified", description: "Show voter names to admins" },
    ],
    requiresMultiSig: true,
    lastUpdated: new Date("2024-09-01"),
    hasPendingChange: false,
  },
];

export function ElectionSettingsSection() {
  const [settings, setSettings] = useState(electionSettingsData);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
  const [showAuthDrawer, setShowAuthDrawer] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<ElectionSetting | null>(null);

  const hasUnsavedChanges = Object.keys(pendingChanges).length > 0;

  const handleSettingChange = (settingId: string, newValue: string) => {
    const setting = settings.find(s => s.id === settingId);
    if (setting && setting.currentValue !== newValue) {
      setPendingChanges(prev => ({ ...prev, [settingId]: newValue }));
    } else {
      setPendingChanges(prev => {
        const { [settingId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSave = (setting: ElectionSetting) => {
    setSelectedSetting(setting);
    setShowAuthDrawer(true);
  };

  const handleAuthComplete = () => {
    if (!selectedSetting) return;
    
    const newValue = pendingChanges[selectedSetting.id];
    if (!newValue) return;

    setSettings(prev => prev.map(s => 
      s.id === selectedSetting.id 
        ? { ...s, currentValue: newValue, hasPendingChange: true, lastUpdated: new Date() }
        : s
    ));

    setPendingChanges(prev => {
      const { [selectedSetting.id]: _, ...rest } = prev;
      return rest;
    });

    toast({
      title: "Setting Updated",
      description: `${selectedSetting.name} has been authorized and updated successfully.`,
    });

    setSelectedSetting(null);
  };

  const getDisplayValue = (settingId: string, currentValue: string) => {
    return pendingChanges[settingId] || currentValue;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Vote className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-semibold">Election Settings</h2>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Configure voting rules, eligibility requirements, and election procedures for your community.
      </p>

      {/* Multi-sig Notice */}
      <div className="flex items-center gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
        <Lock className="h-4 w-4 text-amber-600 shrink-0" />
        <p className="text-xs text-muted-foreground">
          All election settings require multi-signature authorization (President + Secretary or PRO)
        </p>
      </div>

      {/* Settings List */}
      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="space-y-3 pb-6">
          {settings.map((setting) => {
            const Icon = setting.icon;
            const currentDisplayValue = getDisplayValue(setting.id, setting.currentValue);
            const hasChange = pendingChanges[setting.id] !== undefined;
            const currentOption = setting.options.find(o => o.value === currentDisplayValue);

            return (
              <Card key={setting.id} className={hasChange ? "ring-2 ring-primary/50" : ""}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Setting Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{setting.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {setting.description}
                          </p>
                        </div>
                      </div>
                      {setting.hasPendingChange && (
                        <Badge variant="outline" className="shrink-0 text-[10px] bg-amber-500/10 text-amber-700 border-amber-500/30">
                          Pending
                        </Badge>
                      )}
                    </div>

                    {/* Setting Control */}
                    <Select
                      value={currentDisplayValue}
                      onValueChange={(value) => handleSettingChange(setting.id, value)}
                    >
                      <SelectTrigger className="w-full h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {setting.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span>{option.label}</span>
                              {option.description && (
                                <span className="text-xs text-muted-foreground">
                                  {option.description}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground">
                        Updated: {format(new Date(setting.lastUpdated), "MMM d, yyyy")}
                      </p>
                      {hasChange && (
                        <Button 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => handleSave(setting)}
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Submit Change
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Multi-Signature Authorization Drawer */}
      <ModuleAuthorizationDrawer
        open={showAuthDrawer}
        onOpenChange={setShowAuthDrawer}
        module="elections"
        actionTitle="Update Election Setting"
        actionDescription={
          selectedSetting
            ? `Change "${selectedSetting.name}" requires multi-signature authorization`
            : ""
        }
        actionDetails={
          selectedSetting ? (() => {
            const Icon = selectedSetting.icon;
            const currentLabel = selectedSetting.options.find(o => o.value === selectedSetting.currentValue)?.label || selectedSetting.currentValue;
            const newValue = pendingChanges[selectedSetting.id];
            const newLabel = selectedSetting.options.find(o => o.value === newValue)?.label || newValue;
            return (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Icon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{selectedSetting.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedSetting.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Current</span>
                  <span>{currentLabel}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">New Value</span>
                  <span className="font-bold text-primary">{newLabel}</span>
                </div>
              </div>
            );
          })() : undefined
        }
        onAuthorized={handleAuthComplete}
      />
    </div>
  );
}
