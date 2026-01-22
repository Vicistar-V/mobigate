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
      <AccordionItem value="settings" className="border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-4 hover:no-underline">
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
          <div className="space-y-4 w-full overflow-hidden">
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

            {/* Documents & Resources */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm">Documents</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onManageConstitution}>
                    <FileText className="h-4 w-4 mr-2" />
                    Constitution
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onManageResources}>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Resources
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 text-sm col-span-2" onClick={onCommunityRules}>
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
              <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onPrivacySettings}>
                <Shield className="h-4 w-4 mr-2" />
                Privacy
              </Button>
              <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onNotificationSettings}>
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