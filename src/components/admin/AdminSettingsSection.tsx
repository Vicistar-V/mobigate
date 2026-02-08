import { useState } from "react";
import { Settings, User, Image, FileText, FolderOpen, Shield, Bell, BookOpen, Lock, Vote, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ModuleAuthorizationDrawer } from "./authorization/ModuleAuthorizationDrawer";
import { getActionConfig, renderActionDetails } from "./authorization/authorizationActionConfigs";
import { useToast } from "@/hooks/use-toast";
import { mockAdminProposals, mockMemberRecommendations } from "@/data/communityDemocraticSettingsData";
import { DEMOCRATIC_SETTINGS_CONFIG } from "@/types/communityDemocraticSettings";

// Action types for settings module
type SettingsActionType = "update_constitution" | "change_privacy" | "update_rules" | "enable_feature" | "disable_feature" | "upload_constitution" | "delete_constitution" | "deactivate_constitution";

interface AdminSettingsSectionProps {
  onEditProfile: () => void;
  onEditPhotos: () => void;
  onManageConstitution: () => void;
  onManageConstitutionAdmin?: () => void;
  onManageResources: () => void;
  onPrivacySettings: () => void;
  onNotificationSettings: () => void;
  onCommunityRules: () => void;
  onDemocraticPrivacy?: () => void;
}

export function AdminSettingsSection({
  onEditProfile,
  onEditPhotos,
  onManageConstitution,
  onManageConstitutionAdmin,
  onManageResources,
  onPrivacySettings,
  onNotificationSettings,
  onCommunityRules,
  onDemocraticPrivacy,
}: AdminSettingsSectionProps) {
  const { toast } = useToast();

  // Democratic governance stats
  const pendingProposals = mockAdminProposals.filter((p) => p.status === "pending_approval");
  const activeOverrides = mockMemberRecommendations.filter(
    (r) => r.supportPercentage >= DEMOCRATIC_SETTINGS_CONFIG.RECOMMENDATION_THRESHOLD
  );

  // Authorization state
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [authAction, setAuthAction] = useState<{
    type: SettingsActionType;
    details: string;
  } | null>(null);

  const handleConstitutionWithAuth = () => {
    setAuthAction({
      type: "update_constitution",
      details: "Community Constitution",
    });
    setAuthDrawerOpen(true);
  };

  const handlePrivacyWithAuth = () => {
    setAuthAction({
      type: "change_privacy",
      details: "Privacy Settings",
    });
    setAuthDrawerOpen(true);
  };

  const handleRulesWithAuth = () => {
    setAuthAction({
      type: "update_rules",
      details: "Community Rules & Guidelines",
    });
    setAuthDrawerOpen(true);
  };

  const handleAuthorizationComplete = () => {
    if (authAction) {
      const config = getActionConfig("settings", authAction.type);
      toast({
        title: config?.title || "Settings Action Authorized",
        description: `${authAction.details} has been authorized for update.`,
      });
      switch (authAction.type) {
        case "update_constitution":
          if (onManageConstitutionAdmin) {
            onManageConstitutionAdmin();
          } else {
            onManageConstitution();
          }
          break;
        case "change_privacy":
          onPrivacySettings();
          break;
        case "update_rules":
          onCommunityRules();
          break;
      }
    }
    setAuthAction(null);
  };

  // Get action config using centralized templates
  const actionConfig = authAction ? getActionConfig("settings", authAction.type) : null;

  const getAuthActionDetails = () => {
    if (!authAction || !actionConfig) return null;
    
    return renderActionDetails({
      config: actionConfig,
      primaryText: authAction.details,
      secondaryText: "Settings Action",
      module: "settings",
    });
  };

  return (
    <>
      {/* Authorization Drawer - Now using centralized config */}
      <ModuleAuthorizationDrawer
        open={authDrawerOpen}
        onOpenChange={setAuthDrawerOpen}
        module="settings"
        actionTitle={actionConfig?.title || "Settings Action"}
        actionDescription={actionConfig?.description || "Multi-signature authorization required for settings changes"}
        actionDetails={getAuthActionDetails()}
        initiatorRole="secretary"
        onAuthorized={handleAuthorizationComplete}
      />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="settings" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-3 hover:no-underline">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="p-1.5 rounded-lg bg-gray-500/10 shrink-0">
                <Settings className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <h3 className="font-semibold text-sm">Settings</h3>
                <p className="text-xs text-muted-foreground">
                  Profile, privacy & config
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="space-y-3">

              {/* Documents */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  Documents
                  <Lock className="h-2.5 w-2.5" />
                </p>
                <div className="flex flex-col gap-0 divide-y divide-border">
                  <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 active:bg-muted/70 -mx-1 px-1 rounded touch-manipulation" onClick={() => onManageConstitutionAdmin ? onManageConstitutionAdmin() : handleConstitutionWithAuth()}>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Constitution
                  </button>
                  <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onManageResources}>
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    Resources
                  </button>
                  <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={handleRulesWithAuth}>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    Rules & Guidelines
                  </button>
                </div>
              </div>

              {/* Quick Toggles */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Quick Settings</p>
                <div className="space-y-2.5 py-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Label htmlFor="private-community" className="text-sm">Private Community</Label>
                    </div>
                    <Switch id="private-community" defaultChecked className="shrink-0" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Bell className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Label htmlFor="member-notifications" className="text-sm">Notifications</Label>
                    </div>
                    <Switch id="member-notifications" defaultChecked className="shrink-0" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Label htmlFor="auto-approve" className="text-sm">Auto-approve Members</Label>
                    </div>
                    <Switch id="auto-approve" className="shrink-0" />
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="flex flex-col gap-0 divide-y divide-border">
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={handlePrivacyWithAuth}>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Privacy Settings
                </button>
                <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onNotificationSettings}>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  Notification Settings
                </button>
              </div>

              {/* Democratic Governance Status */}
              <div className="p-2.5 rounded-lg border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Vote className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Democratic Governance</p>
                      <p className="text-xs text-muted-foreground">60% member approval required</p>
                    </div>
                  </div>
                  <button className="text-xs text-primary hover:underline" onClick={onDemocraticPrivacy}>
                    View
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {pendingProposals.length > 0 && (
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 text-[10px] px-1.5 py-0">
                      <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                      {pendingProposals.length} Pending
                    </Badge>
                  )}
                  {activeOverrides.length > 0 && (
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-[10px] px-1.5 py-0">
                      <Users className="h-2.5 w-2.5 mr-0.5" />
                      {activeOverrides.length} Override
                    </Badge>
                  )}
                  {pendingProposals.length === 0 && activeOverrides.length === 0 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      All approved
                    </Badge>
                  )}
                </div>
              </div>

              {/* Authorization Info */}
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <div className="flex items-start gap-2">
                  <Lock className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-xs text-muted-foreground leading-snug">
                    Settings require President + Secretary + Legal Adviser
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 text-amber-600 mt-0.5 shrink-0" />
                  <span className="text-xs text-amber-700 dark:text-amber-300 leading-snug">
                    All changes must receive 60% member approval
                  </span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
