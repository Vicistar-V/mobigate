import { Settings, User, Image, FileText, FolderOpen, Shield, Bell, BookOpen } from "lucide-react";
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
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="settings" className="border rounded-lg">
        <AccordionTrigger className="px-4 hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-500/10">
              <Settings className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Community Settings</h3>
              <p className="text-xs text-muted-foreground">
                Profile, privacy, and configuration
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            {/* Profile Settings */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm">Profile & Appearance</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={onEditProfile}>
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" onClick={onEditPhotos}>
                    <Image className="h-4 w-4 mr-2" />
                    Edit Photos
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Documents & Resources */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm">Documents & Resources</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={onManageConstitution}>
                    <FileText className="h-4 w-4 mr-2" />
                    Constitution
                  </Button>
                  <Button variant="outline" size="sm" onClick={onManageResources}>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Resources
                  </Button>
                  <Button variant="outline" size="sm" onClick={onCommunityRules} className="col-span-2">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Community Rules & Guidelines
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Toggles */}
            <Card>
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm">Quick Settings</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="private-community" className="text-sm">Private Community</Label>
                  </div>
                  <Switch id="private-community" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="member-notifications" className="text-sm">Member Notifications</Label>
                  </div>
                  <Switch id="member-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="auto-approve" className="text-sm">Auto-approve Members</Label>
                  </div>
                  <Switch id="auto-approve" />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={onPrivacySettings}>
                <Shield className="h-4 w-4 mr-2" />
                Privacy
              </Button>
              <Button variant="outline" size="sm" onClick={onNotificationSettings}>
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
