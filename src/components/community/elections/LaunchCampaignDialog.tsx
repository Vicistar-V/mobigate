import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Rocket, ImagePlus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

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

  const handleSubmit = () => {
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
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold">Launch Your Campaign</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 pb-6">
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
              <Popover>
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
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              {/* End Date */}
              <Popover>
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
                    onSelect={setEndDate}
                    disabled={(date) => date < (startDate || new Date())}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Campaign Photo (Optional) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Campaign Photo (Optional)</Label>
            <Button variant="outline" className="w-full h-12 border-dashed">
              <ImagePlus className="mr-2 h-4 w-4" />
              Add Campaign Photo
            </Button>
          </div>

          {/* Submit Button */}
          <Button onClick={handleSubmit} className="w-full h-14 text-base font-semibold mt-4">
            <Rocket className="mr-2 h-5 w-5" />
            Launch Campaign
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
