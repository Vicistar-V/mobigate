import { useState, useRef } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Rocket, ImagePlus, X, Settings, Eye } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { CampaignSettingsDialog } from "./CampaignSettingsDialog";
import { CampaignPreviewSheet } from "./CampaignPreviewSheet";
import { CampaignFormData } from "@/types/campaignSystem";

const colorOptions = [
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "purple", label: "Purple", class: "bg-purple-600" },
  { value: "magenta", label: "Magenta", class: "bg-pink-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "blue", label: "Blue", class: "bg-blue-500" },
];

interface LaunchCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const officeOptions = [
  "President General",
  "Vice President",
  "Secretary General",
  "Assistant Secretary",
  "Treasurer",
  "Financial Secretary",
  "Public Relations Officer",
  "Welfare Officer",
  "Organizing Secretary",
];

export const LaunchCampaignDialog = ({ open, onOpenChange }: LaunchCampaignDialogProps) => {
  const [candidateName, setCandidateName] = useState("");
  const [office, setOffice] = useState("");
  const [description, setDescription] = useState("");
  const [manifesto, setManifesto] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [campaignImage, setCampaignImage] = useState<string | null>(null);
  const [campaignColor, setCampaignColor] = useState("green");
  const [showCampaignSettings, setShowCampaignSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please select an image under 2MB",
        variant: "destructive",
      });
      return;
    }

    // Convert to base64 for preview
    const reader = new FileReader();
    reader.onloadend = () => setCampaignImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCampaignImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProceedToSettings = () => {
    if (!candidateName || !office) {
      toast({
        title: "Missing fields",
        description: "Please enter your name and select an office",
        variant: "destructive",
      });
      return;
    }
    setShowCampaignSettings(true);
  };

  const handleCampaignLaunched = (data: CampaignFormData) => {
    toast({
      title: "Campaign Launched! 🎉",
      description: `Your campaign for ${data.office} is now live!`,
    });

    // Reset form
    setCandidateName("");
    setOffice("");
    setDescription("");
    setManifesto("");
    setStartDate(undefined);
    setEndDate(undefined);
    setCampaignImage(null);
    setCampaignColor("green");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  const handleSimpleLaunch = () => {
    if (!candidateName || !office || !description || !manifesto || !startDate || !endDate) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (endDate < startDate) {
      toast({
        title: "Invalid dates",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Campaign Launched!",
      description: `Your campaign for ${office} has been submitted for review.`,
    });

    // Reset form
    setCandidateName("");
    setOffice("");
    setDescription("");
    setManifesto("");
    setStartDate(undefined);
    setEndDate(undefined);
    setCampaignImage(null);
    setCampaignColor("green");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    setStartDateOpen(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    setEndDateOpen(false);
  };

  const handlePreviewCampaign = () => {
    setShowPreview(true);
  };

  // Check if minimum required fields are filled for preview
  const canPreview = candidateName || office || description || manifesto;

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] flex flex-col">
          <DrawerHeader className="shrink-0 border-b pb-3">
            <DrawerTitle className="text-xl font-bold">Launch Your Campaign</DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <ScrollArea className="flex-1 overflow-y-auto touch-auto">
              <div className="px-4 py-4 space-y-5">
                {/* Candidate Name */}
                <div className="space-y-2">
                  <Label htmlFor="candidateName" className="text-sm font-medium">
                    Candidate Name *
                  </Label>
                  <Input
                    id="candidateName"
                    placeholder="Enter your full name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Office/Position */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Office/Position *</Label>
                  <Select value={office} onValueChange={setOffice}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select office to contest" />
                    </SelectTrigger>
                    <SelectContent>
                      {officeOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Campaign Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Campaign Tagline *
                  </Label>
                  <Input
                    id="description"
                    placeholder="A short, catchy campaign slogan"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Manifesto */}
                <div className="space-y-2">
                  <Label htmlFor="manifesto" className="text-sm font-medium">
                    Your Manifesto *
                  </Label>
                  <Textarea
                    id="manifesto"
                    placeholder="What will you do if elected? Share your vision and plans..."
                    value={manifesto}
                    onChange={(e) => setManifesto(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                </div>

                {/* Campaign Period */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Campaign Period *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Start Date */}
                    <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-12 justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "MMM dd") : "Start"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={handleStartDateSelect}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>

                    {/* End Date */}
                    <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-12 justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "MMM dd") : "End"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={handleEndDateSelect}
                          disabled={(date) => date < (startDate || new Date())}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Campaign Color */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Campaign Color</Label>
                  <div className="flex gap-3 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setCampaignColor(color.value)}
                        className={cn(
                          "w-10 h-10 rounded-full transition-all",
                          color.class,
                          campaignColor === color.value && "ring-2 ring-offset-2 ring-primary scale-110"
                        )}
                        aria-label={`Select ${color.label} color`}
                      />
                    ))}
                  </div>
                </div>

                {/* Campaign Photo (Optional) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Campaign Photo (Optional)</Label>
                  {campaignImage ? (
                    <div className="space-y-2">
                      <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                        <img 
                          src={campaignImage} 
                          alt="Campaign preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex gap-2">
                        <label className="flex-1">
                          <Button variant="outline" className="w-full" asChild>
                            <span>
                              <ImagePlus className="mr-2 h-4 w-4" />
                              Change Photo
                            </span>
                          </Button>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageUpload}
                            ref={fileInputRef}
                          />
                        </label>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={handleRemoveImage}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 hover:border-primary/50 transition-colors">
                        <div className="flex flex-col items-center gap-2 text-center">
                          <ImagePlus className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm font-medium">Add Campaign Photo</p>
                          <p className="text-xs text-muted-foreground">JPG, PNG up to 2MB</p>
                        </div>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                      />
                    </label>
                  )}
                </div>

                {/* Extra bottom padding for scrolling */}
                <div className="h-4" />
              </div>
            </ScrollArea>

            {/* Fixed Action Buttons at Bottom */}
            <div className="shrink-0 px-4 py-4 border-t bg-background space-y-3">
              {/* Preview Campaign Button */}
              <Button 
                onClick={handlePreviewCampaign}
                variant="outline"
                className="w-full h-12 text-base border-primary/50 text-primary hover:bg-primary/5"
                disabled={!canPreview}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Campaign
              </Button>

              <Button 
                onClick={handleProceedToSettings} 
                className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90"
              >
                <Settings className="mr-2 h-5 w-5" />
                Configure Campaign (Audience & Fees)
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>
              
              <Button 
                onClick={handleSimpleLaunch} 
                variant="outline"
                className="w-full h-12 text-base"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Quick Launch (Free)
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Campaign Preview Sheet */}
      <CampaignPreviewSheet
        open={showPreview}
        onOpenChange={setShowPreview}
        data={{
          candidateName,
          office,
          tagline: description,
          manifesto,
          startDate,
          endDate,
          campaignImage,
          campaignColor,
        }}
      />

      {/* Campaign Settings Dialog for advanced configuration */}
      <CampaignSettingsDialog
        open={showCampaignSettings}
        onOpenChange={setShowCampaignSettings}
        candidateName={candidateName}
        office={office}
        walletBalance={15000}
        onLaunchCampaign={handleCampaignLaunched}
      />
    </>
  );
};
