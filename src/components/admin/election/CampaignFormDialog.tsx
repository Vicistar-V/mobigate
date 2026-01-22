import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminCampaign } from "@/data/adminElectionData";
import { useToast } from "@/hooks/use-toast";

interface CampaignFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign?: AdminCampaign | null;
}

const officeOptions = [
  "President General",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Financial Secretary",
  "Public Relations Officer",
  "Welfare Officer"
];

export function CampaignFormDialog({ open, onOpenChange, campaign }: CampaignFormDialogProps) {
  const { toast } = useToast();
  const isEditing = !!campaign;

  const [formData, setFormData] = useState({
    candidateName: "",
    office: "",
    slogan: "",
    manifesto: "",
    priorities: [""],
    startDate: "",
    endDate: "",
    publishImmediately: false
  });

  useEffect(() => {
    if (campaign) {
      setFormData({
        candidateName: campaign.candidateName,
        office: campaign.office,
        slogan: campaign.slogan,
        manifesto: campaign.manifesto,
        priorities: campaign.priorities.length > 0 ? campaign.priorities : [""],
        startDate: campaign.startDate.toISOString().split('T')[0],
        endDate: campaign.endDate.toISOString().split('T')[0],
        publishImmediately: campaign.status === 'active'
      });
    } else {
      setFormData({
        candidateName: "",
        office: "",
        slogan: "",
        manifesto: "",
        priorities: [""],
        startDate: "",
        endDate: "",
        publishImmediately: false
      });
    }
  }, [campaign, open]);

  const handleAddPriority = () => {
    setFormData(prev => ({
      ...prev,
      priorities: [...prev.priorities, ""]
    }));
  };

  const handleRemovePriority = (index: number) => {
    setFormData(prev => ({
      ...prev,
      priorities: prev.priorities.filter((_, i) => i !== index)
    }));
  };

  const handlePriorityChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      priorities: prev.priorities.map((p, i) => i === index ? value : p)
    }));
  };

  const handleSubmit = () => {
    if (!formData.candidateName || !formData.office) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: isEditing ? "Campaign Updated" : "Campaign Created",
      description: isEditing 
        ? "The campaign has been updated successfully"
        : formData.publishImmediately 
          ? "Campaign published successfully" 
          : "Campaign saved as draft"
    });
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle>{isEditing ? "Edit Campaign" : "Create New Campaign"}</DrawerTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 p-4 overflow-auto touch-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-4">
            {/* Candidate Selection */}
            <div className="space-y-2">
              <Label htmlFor="candidate">Candidate Name *</Label>
              <Input
                id="candidate"
                value={formData.candidateName}
                onChange={(e) => setFormData(prev => ({ ...prev, candidateName: e.target.value }))}
                placeholder="Select or enter candidate name"
              />
            </div>

            {/* Office Position */}
            <div className="space-y-2">
              <Label>Office Position *</Label>
              <Select 
                value={formData.office} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, office: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select office" />
                </SelectTrigger>
                <SelectContent>
                  {officeOptions.map(office => (
                    <SelectItem key={office} value={office}>{office}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Campaign Slogan */}
            <div className="space-y-2">
              <Label htmlFor="slogan">Campaign Slogan</Label>
              <Input
                id="slogan"
                value={formData.slogan}
                onChange={(e) => setFormData(prev => ({ ...prev, slogan: e.target.value }))}
                placeholder="Enter a catchy campaign slogan"
              />
            </div>

            {/* Campaign Period */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Manifesto */}
            <div className="space-y-2">
              <Label htmlFor="manifesto">Campaign Manifesto</Label>
              <Textarea
                id="manifesto"
                value={formData.manifesto}
                onChange={(e) => setFormData(prev => ({ ...prev, manifesto: e.target.value }))}
                placeholder="Enter the campaign manifesto..."
                rows={5}
              />
            </div>

            {/* Key Priorities */}
            <div className="space-y-2">
              <Label>Key Priorities</Label>
              <div className="space-y-2">
                {formData.priorities.map((priority, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={priority}
                      onChange={(e) => handlePriorityChange(index, e.target.value)}
                      placeholder={`Priority ${index + 1}`}
                    />
                    {formData.priorities.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemovePriority(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddPriority}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Priority
                </Button>
              </div>
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-sm">Publish Immediately</p>
                <p className="text-xs text-muted-foreground">Make campaign visible to members</p>
              </div>
              <Switch
                checked={formData.publishImmediately}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, publishImmediately: checked }))}
              />
            </div>
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t gap-2">
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            {isEditing ? "Save Changes" : formData.publishImmediately ? "Publish Campaign" : "Save as Draft"}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
