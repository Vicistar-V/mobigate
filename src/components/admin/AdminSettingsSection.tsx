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
type SettingsActionType = "update_constitution" | "change_privacy" | "update_rules" | "enable_feature" | "disable_feature";

interface AdminSettingsSectionProps {
  onEditProfile: () => void;
  onEditPhotos: () => void;
  onManageConstitution: () => void;
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
          onManageConstitution();
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
          <AccordionContent className="px-2.5 pb-2.5">
            <div className="space-y-2.5">
              {/* Profile Settings */}
              <div className="flex flex-col gap-1.5">
                <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-start" onClick={onEditProfile}>
                  <User className="h-3.5 w-3.5 mr-2 shrink-0" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-start" onClick={onEditPhotos}>
                  <Image className="h-3.5 w-3.5 mr-2 shrink-0" />
                  Edit Photos
                </Button>
              </div>

              {/* Documents & Resources - With Authorization */}
              <Card className="border-0 shadow-none bg-muted/30">
                <CardHeader className="p-2.5 pb-1">
                  <CardTitle className="text-xs flex items-center gap-1.5">
                    Documents
                    <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2.5 pt-0">
                  <div className="flex flex-col gap-1.5">
                    <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-start" onClick={handleConstitutionWithAuth}>
                      <FileText className="h-3.5 w-3.5 mr-2 shrink-0" />
                      Constitution
                    </Button>
                    <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-start" onClick={onManageResources}>
                      <FolderOpen className="h-3.5 w-3.5 mr-2 shrink-0" />
                      Resources
                    </Button>
                    <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-start" onClick={handleRulesWithAuth}>
                      <BookOpen className="h-3.5 w-3.5 mr-2 shrink-0" />
                      Rules & Guidelines
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Toggles */}
              <Card className="border-0 shadow-none bg-muted/30">
                <CardHeader className="p-2.5 pb-1">
                  <CardTitle className="text-xs">Quick Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-2.5 pt-0 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <Label htmlFor="private-community" className="text-xs">Private Community</Label>
                    </div>
                    <Switch id="private-community" defaultChecked className="shrink-0" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Bell className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <Label htmlFor="member-notifications" className="text-xs">Notifications</Label>
                    </div>
                    <Switch id="member-notifications" defaultChecked className="shrink-0" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <Label htmlFor="auto-approve" className="text-xs">Auto-approve Members</Label>
                    </div>
                    <Switch id="auto-approve" className="shrink-0" />
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <div className="flex flex-col gap-1.5">
                <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-start" onClick={handlePrivacyWithAuth}>
                  <Shield className="h-3.5 w-3.5 mr-2 shrink-0" />
                  Privacy Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-start" onClick={onNotificationSettings}>
                  <Bell className="h-3.5 w-3.5 mr-2 shrink-0" />
                  Notification Settings
                </Button>
              </div>

              {/* Democratic Governance Status */}
              <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800">
                <CardContent className="p-2.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Vote className="h-4 w-4 text-emerald-600 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium">Democratic Governance</p>
                        <p className="text-[10px] text-muted-foreground">60% member approval required</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] px-2 shrink-0" onClick={onDemocraticPrivacy}>
                      View
                    </Button>
                  </div>

                  {/* Status Badges */}
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
                </CardContent>
              </Card>

              {/* Authorization Info */}
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 p-2 bg-muted/30 rounded-md">
                  <Lock className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-xs text-muted-foreground leading-snug">
                    Settings require President + Secretary + Legal Adviser
                  </span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-md">
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
