import { useState } from "react";
import { Settings, User, Image, FileText, FolderOpen, Shield, Bell, BookOpen, Lock } from "lucide-react";
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
import { ModuleAuthorizationDrawer } from "./authorization/ModuleAuthorizationDrawer";
import { getActionConfig, renderActionDetails } from "./authorization/authorizationActionConfigs";
import { useToast } from "@/hooks/use-toast";

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
}

export function AdminSettingsSection({
  onEditProfile,
  onEditPhotos,
  onManageConstitution,
  onManageResources,
  onPrivacySettings,
  onNotificationSettings,
  onCommunityRules,
}: AdminSettingsSectionProps) {
  const { toast } = useToast();

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

      <Accordion type="single" collapsible className="w-full max-w-full">
        <AccordionItem value="settings" className="border rounded-lg overflow-hidden">
          <AccordionTrigger className="px-4 hover:no-underline max-w-full">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-gray-500/10 shrink-0">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
              <div className="text-left min-w-0">
                <h3 className="font-semibold text-base truncate">Settings</h3>
                <p className="text-sm text-muted-foreground truncate">
                  Profile, privacy & config
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 w-full max-w-full overflow-hidden">
              {/* Profile Settings */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-sm">Profile</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onEditProfile}>
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onEditPhotos}>
                      <Image className="h-4 w-4 mr-2" />
                      Edit Photos
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Documents & Resources - With Authorization */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    Documents
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 text-sm" 
                      onClick={handleConstitutionWithAuth}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Constitution
                    </Button>
                    <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onManageResources}>
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Resources
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 text-sm col-span-2" 
                      onClick={handleRulesWithAuth}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Rules & Guidelines
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Toggles */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-sm">Quick Settings</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Label htmlFor="private-community" className="text-sm truncate">Private Community</Label>
                    </div>
                    <Switch id="private-community" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Bell className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Label htmlFor="member-notifications" className="text-sm truncate">Notifications</Label>
                    </div>
                    <Switch id="member-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Label htmlFor="auto-approve" className="text-sm truncate">Auto-approve Members</Label>
                    </div>
                    <Switch id="auto-approve" />
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 text-sm" 
                  onClick={handlePrivacyWithAuth}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy
                </Button>
                <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onNotificationSettings}>
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
              </div>

              {/* Authorization Info */}
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Settings changes require President + Secretary + Legal Adviser
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}