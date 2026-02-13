import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  FileText,
  Wallet,
  Users,
  Clock,
  Save,
  Info,
  CheckCircle2,
  Percent,
  Calendar,
} from "lucide-react";
import { mockMinutesSettings } from "@/data/meetingsData";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminMinutesSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminMinutesSettings = ({
  open,
  onOpenChange,
}: AdminMinutesSettingsProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [downloadFee, setDownloadFee] = useState(mockMinutesSettings.downloadFeeDefault.toString());
  const [adoptionThreshold, setAdoptionThreshold] = useState(mockMinutesSettings.adoptionThreshold);
  const [gracePeriod, setGracePeriod] = useState(mockMinutesSettings.attendanceGracePeriodDays.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    
    toast({
      title: "Settings Saved",
      description: "Meeting minutes settings have been updated successfully.",
    });
    
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-6">
      {/* Current Settings Overview */}
      <Card className="p-4 bg-muted/30">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-1 text-sm">
            <p className="font-medium">Configure Meeting Minutes Settings</p>
            <p className="text-muted-foreground">
              These settings control how meeting minutes are managed, including 
              download fees, adoption requirements, and attendance tracking.
            </p>
          </div>
        </div>
      </Card>

      {/* Download Fee */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Download Fee</h3>
            <p className="text-sm text-muted-foreground">
              Fee charged when members download minutes
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold">M</span>
            <Input
              type="number"
              value={downloadFee}
              onChange={(e) => setDownloadFee(e.target.value)}
              min={0}
              className="flex-1 text-lg font-semibold"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Revenue from downloads is credited to the Community Wallet.
          </p>
        </div>
      </Card>

      {/* Adoption Threshold */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-green-500/10">
            <Percent className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold">Adoption Threshold</h3>
            <p className="text-sm text-muted-foreground">
              Percentage of members required to adopt minutes
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Required Majority</span>
            <Badge variant="outline" className="text-lg font-bold">
              {adoptionThreshold}%
            </Badge>
          </div>
          <Slider
            value={[adoptionThreshold]}
            onValueChange={(values) => setAdoptionThreshold(values[0])}
            min={50}
            max={80}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>50%</span>
            <span className="text-green-600 font-medium">
              {adoptionThreshold >= 60 && adoptionThreshold <= 70 
                ? "✓ Recommended (60-70%)" 
                : ""}
            </span>
            <span>80%</span>
          </div>
        </div>
        <Alert className="mt-4 border-amber-200 bg-amber-50">
          <AlertDescription className="text-amber-800 text-xs">
            New meetings cannot commence until Minutes of the last previous meeting have been duly adopted by the recommended percentage threshold.
          </AlertDescription>
        </Alert>
      </Card>

      {/* Attendance Grace Period */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">Attendance Grace Period</h3>
            <p className="text-sm text-muted-foreground">
              Days after adoption to mark attendance via download
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={gracePeriod}
              onChange={(e) => setGracePeriod(e.target.value)}
              min={30}
              max={180}
              className="flex-1 text-lg font-semibold"
            />
            <span className="text-lg font-medium text-muted-foreground">days</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Members who don't download within this period are marked as "Absent" 
            from the meeting. Recommended: 90 days.
          </p>
        </div>
      </Card>

      {/* Summary Card */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Current Configuration Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Download Fee</span>
            <span className="font-medium">M{downloadFee}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Adoption Threshold</span>
            <span className="font-medium">{adoptionThreshold}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Grace Period</span>
            <span className="font-medium">{gracePeriod} days</span>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <Button
        className="w-full gap-2"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <>Processing...</>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Settings
          </>
        )}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>Minutes Settings</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            {content}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Minutes Settings</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          {content}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
