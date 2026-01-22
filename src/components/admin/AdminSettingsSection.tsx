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
        <AccordionTrigger className="px-3 hover:no-underline">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-gray-500/10 shrink-0">
              <Settings className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-left min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">Settings</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                Profile, privacy & config
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <div className="space-y-3 w-full overflow-hidden">
            {/* Profile Settings */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-1.5 pt-2.5 px-2.5">
                <CardTitle className="text-xs">Profile</CardTitle>
              </CardHeader>
              <CardContent className="px-2.5 pb-2.5 pt-0">
                <div className="grid grid-cols-2 gap-1.5">
                  <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onEditProfile}>
                    <User className="h-3 w-3 mr-1" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onEditPhotos}>
                    <Image className="h-3 w-3 mr-1" />
                    Edit Photos
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Documents & Resources */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-1.5 pt-2.5 px-2.5">
                <CardTitle className="text-xs">Documents</CardTitle>
              </CardHeader>
              <CardContent className="px-2.5 pb-2.5 pt-0">
                <div className="grid grid-cols-2 gap-1.5">
                  <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onManageConstitution}>
                    <FileText className="h-3 w-3 mr-1" />
                    Constitution
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onManageResources}>
                    <FolderOpen className="h-3 w-3 mr-1" />
                    Resources
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-[10px] col-span-2" onClick={onCommunityRules}>
                    <BookOpen className="h-3 w-3 mr-1" />
                    Rules & Guidelines
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Toggles */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-1.5 pt-2.5 px-2.5">
                <CardTitle className="text-xs">Quick Settings</CardTitle>
              </CardHeader>
              <CardContent className="px-2.5 pb-2.5 pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Shield className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <Label htmlFor="private-community" className="text-[11px] truncate">Private</Label>
                  </div>
                  <Switch id="private-community" defaultChecked className="scale-90" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Bell className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <Label htmlFor="member-notifications" className="text-[11px] truncate">Notifications</Label>
                  </div>
                  <Switch id="member-notifications" defaultChecked className="scale-90" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <Label htmlFor="auto-approve" className="text-[11px] truncate">Auto-approve</Label>
                  </div>
                  <Switch id="auto-approve" className="scale-90" />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <div className="grid grid-cols-2 gap-1.5">
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onPrivacySettings}>
                <Shield className="h-3 w-3 mr-1" />
                Privacy
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onNotificationSettings}>
                <Bell className="h-3 w-3 mr-1" />
                Notifications
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
