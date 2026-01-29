import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Settings,
  Shield,
  Vote,
  Wallet,
  Users,
  FileText,
  Calendar,
  Megaphone,
  Search,
  ChevronRight,
  AlertTriangle,
  Check,
  Clock,
  Lock,
  Info,
  ArrowLeft,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { 
  CommunitySettingCategory,
  SETTING_CATEGORY_LABELS,
  DEMOCRATIC_SETTINGS_CONFIG,
} from "@/types/communityDemocraticSettings";
import {
  AdminSetting,
  privacySettings,
  generalSettings,
  electionSettings,
  financeSettings,
  membershipSettings,
  postingSettings,
  meetingSettings,
  promotionSettings,
  getAllSettings,
  getSettingsStats,
} from "@/data/adminSettingsData";
import { SettingsDetailSheet } from "./SettingsDetailSheet";
import { format } from "date-fns";

interface AdminSettingsTabProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CategoryConfig {
  key: CommunitySettingCategory;
  label: string;
  icon: React.ElementType;
  color: string;
  settings: AdminSetting[];
}

const categories: CategoryConfig[] = [
  { 
    key: "privacy_settings", 
    label: "Privacy Settings", 
    icon: Shield, 
    color: "text-violet-600 bg-violet-500/10",
    settings: privacySettings
  },
  { 
    key: "general_settings", 
    label: "General Settings", 
    icon: Settings, 
    color: "text-gray-600 bg-gray-500/10",
    settings: generalSettings
  },
  { 
    key: "election_settings", 
    label: "Election Settings", 
    icon: Vote, 
    color: "text-blue-600 bg-blue-500/10",
    settings: electionSettings
  },
  { 
    key: "finance_settings", 
    label: "Finance Settings", 
    icon: Wallet, 
    color: "text-green-600 bg-green-500/10",
    settings: financeSettings
  },
  { 
    key: "membership_settings", 
    label: "Membership Settings", 
    icon: Users, 
    color: "text-amber-600 bg-amber-500/10",
    settings: membershipSettings
  },
  { 
    key: "posting_settings", 
    label: "Posting & Content", 
    icon: FileText, 
    color: "text-pink-600 bg-pink-500/10",
    settings: postingSettings
  },
  { 
    key: "meeting_settings", 
    label: "Meeting Settings", 
    icon: Calendar, 
    color: "text-cyan-600 bg-cyan-500/10",
    settings: meetingSettings
  },
  { 
    key: "promotion_settings", 
    label: "Promotion & Visibility", 
    icon: Megaphone, 
    color: "text-orange-600 bg-orange-500/10",
    settings: promotionSettings
  },
];

export function AdminSettingsTab({ open, onOpenChange }: AdminSettingsTabProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSetting, setSelectedSetting] = useState<AdminSetting | null>(null);
  const [showSettingDetail, setShowSettingDetail] = useState(false);
  
  const stats = getSettingsStats();
  const allSettings = getAllSettings();

  // Filter settings based on search
  const filteredSettings = searchQuery.trim()
    ? allSettings.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const handleSettingClick = (setting: AdminSetting) => {
    setSelectedSetting(setting);
    setShowSettingDetail(true);
  };

  const handleProposalSubmit = (settingId: string, newValue: string, reason?: string) => {
    toast({
      title: "Change Proposed",
      description: "Your proposed setting change has been submitted for member approval."
    });
  };

  const SettingRow = ({ setting }: { setting: AdminSetting }) => {
    const currentOption = setting.options.find(o => o.value === setting.currentValue);
    const isApproved = setting.approvalPercentage >= DEMOCRATIC_SETTINGS_CONFIG.APPROVAL_THRESHOLD;
    
    return (
      <button
        className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
        onClick={() => handleSettingClick(setting)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{setting.name}</p>
            {setting.hasPendingChange && (
              <Badge variant="secondary" className="text-[9px] px-1.5 bg-amber-100 text-amber-700 shrink-0">
                <Clock className="h-2 w-2 mr-0.5" />
                Pending
              </Badge>
            )}
            {setting.requiresMultiSig && (
              <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-muted-foreground truncate">
              {currentOption?.label || setting.currentValue}
            </p>
            <span className={`text-[10px] ${isApproved ? 'text-green-600' : 'text-amber-600'}`}>
              ({setting.approvalPercentage}%)
            </span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </button>
    );
  };

  const Content = () => (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="bg-muted/30">
          <CardContent className="p-2 text-center">
            <p className="text-lg font-bold">{stats.total}</p>
            <p className="text-[9px] text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-2 text-center">
            <p className="text-lg font-bold text-amber-600">{stats.pending}</p>
            <p className="text-[9px] text-amber-600">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-2 text-center">
            <p className="text-lg font-bold text-green-600">{stats.approved}</p>
            <p className="text-[9px] text-green-600">Approved</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-2 text-center">
            <p className="text-lg font-bold text-red-600">{stats.needsReview}</p>
            <p className="text-[9px] text-red-600">Review</p>
          </CardContent>
        </Card>
      </div>

      {/* Democratic Governance Notice */}
      <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <Vote className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Democratic Governance Active
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                All setting changes require {DEMOCRATIC_SETTINGS_CONFIG.APPROVAL_THRESHOLD}% member approval. 
                Members can also recommend alternative values.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search settings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {/* Search Results */}
      {filteredSettings && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Search Results ({filteredSettings.length})
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSearchQuery("")}
            >
              Clear
            </Button>
          </div>
          {filteredSettings.length === 0 ? (
            <Card className="bg-muted/30">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">No settings found matching "{searchQuery}"</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-1.5">
              {filteredSettings.map(setting => (
                <SettingRow key={setting.id} setting={setting} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories Accordion */}
      {!filteredSettings && (
        <Accordion type="multiple" defaultValue={["privacy_settings"]} className="space-y-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const pendingCount = category.settings.filter(s => s.hasPendingChange).length;
            
            return (
              <AccordionItem 
                key={category.key} 
                value={category.key}
                className="border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-3 py-2.5 hover:no-underline">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${category.color.split(' ')[1]}`}>
                      <Icon className={`h-4 w-4 ${category.color.split(' ')[0]}`} />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">{category.label}</h4>
                        {pendingCount > 0 && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 bg-amber-100 text-amber-700">
                            {pendingCount} pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {category.settings.length} settings
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="space-y-1.5">
                    {category.settings.map(setting => (
                      <SettingRow key={setting.id} setting={setting} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {/* Authorization Info */}
      <Card className="bg-muted/30">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-start gap-2">
            <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground">
              <strong>Multi-Signature Required:</strong> Most settings require authorization from 
              President + Secretary + Legal Adviser before being submitted for member approval.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground">
              <strong>Member Recommendations:</strong> Members can recommend alternative values. 
              If a recommendation reaches 60% support, it overrides admin settings.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Help Info */}
      <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-600 dark:text-blue-400">
              Tap any setting to view details, propose changes, or see current approval status. 
              Proposals expire after {DEMOCRATIC_SETTINGS_CONFIG.PROPOSAL_EXPIRY_DAYS} days without decision.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[92vh]">
            <DrawerHeader className="border-b pb-3">
              <DrawerTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Community Settings
              </DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
              <Content />
            </ScrollArea>
          </DrawerContent>
        </Drawer>

        <SettingsDetailSheet
          open={showSettingDetail}
          onOpenChange={setShowSettingDetail}
          setting={selectedSetting}
          onProposalSubmit={handleProposalSubmit}
        />
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Community Settings
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <Content />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <SettingsDetailSheet
        open={showSettingDetail}
        onOpenChange={setShowSettingDetail}
        setting={selectedSetting}
        onProposalSubmit={handleProposalSubmit}
      />
    </>
  );
}
