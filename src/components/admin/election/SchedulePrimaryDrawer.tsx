import { useState } from "react";
import { 
  Vote, 
  Calendar, 
  Clock, 
  Info, 
  Star,
  Trophy,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Available offices for primary scheduling
const availableOffices = [
  { id: "office-3", name: "Secretary General" },
  { id: "office-4", name: "Treasurer" },
  { id: "office-5", name: "Financial Secretary" },
  { id: "office-6", name: "Public Relations Officer" },
  { id: "office-7", name: "Welfare Officer" },
  { id: "office-8", name: "Director of Socials" },
  { id: "office-9", name: "Women Leader" },
  { id: "office-10", name: "Youth Leader" },
];

interface SchedulePrimaryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduled?: () => void;
}

export function SchedulePrimaryDrawer({
  open,
  onOpenChange,
  onScheduled
}: SchedulePrimaryDrawerProps) {
  const [selectedOffice, setSelectedOffice] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const isValid = selectedOffice && scheduledDate && startTime && endTime;

  const handleSchedule = async () => {
    if (!isValid) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    onScheduled?.();
    setIsSubmitting(false);
    
    // Reset form
    setSelectedOffice("");
    setScheduledDate(undefined);
    setStartTime("09:00");
    setEndTime("17:00");
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent 
        side="bottom" 
        className="h-[92vh] rounded-t-2xl p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <SheetTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              Schedule Primary Election
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Content */}
        <ScrollArea className="flex-1 overflow-y-auto touch-auto">
          <div className="px-4 py-4 space-y-5">
            {/* Office Selection */}
            <div className="space-y-2">
              <Label htmlFor="office-select" className="text-sm font-medium">
                Select Office <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedOffice} onValueChange={setSelectedOffice}>
                <SelectTrigger 
                  id="office-select"
                  className="h-12 text-base touch-manipulation"
                >
                  <SelectValue placeholder="Choose an office" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {availableOffices.map((office) => (
                    <SelectItem 
                      key={office.id} 
                      value={office.id}
                      className="h-11 text-base"
                    >
                      {office.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Scheduled Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Scheduled Date <span className="text-destructive">*</span>
              </Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal text-base touch-manipulation",
                      !scheduledDate && "text-muted-foreground"
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "MMMM d, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[100]" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={scheduledDate}
                    onSelect={(date) => {
                      setScheduledDate(date);
                      setDatePickerOpen(false);
                    }}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Voting Time */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Voting Time <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Start Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-12 pl-10 text-base touch-manipulation"
                      onClick={(e) => e.stopPropagation()}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">End Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="h-12 pl-10 text-base touch-manipulation"
                      onClick={(e) => e.stopPropagation()}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Advancement Rules Info */}
            <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-start gap-2.5">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-xs space-y-1.5 min-w-0">
                  <p className="font-semibold text-blue-700 dark:text-blue-400">
                    Advancement Rules
                  </p>
                  <ul className="text-muted-foreground space-y-1">
                    <li className="flex items-center gap-1.5">
                      <Star className="h-3 w-3 text-emerald-500 fill-emerald-500 shrink-0" />
                      <span>≥25% votes = Auto-qualifies</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Trophy className="h-3 w-3 text-amber-500 shrink-0" />
                      <span>Top votes fill remaining slots</span>
                    </li>
                    <li>• Maximum 4 candidates advance</li>
                    <li>• Minimum 2 candidates required</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Selected Summary */}
            {selectedOffice && scheduledDate && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                  Summary
                </p>
                <p className="text-xs text-muted-foreground">
                  Primary for <span className="font-medium text-foreground">
                    {availableOffices.find(o => o.id === selectedOffice)?.name}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Scheduled: <span className="font-medium text-foreground">
                    {format(scheduledDate, "MMMM d, yyyy")}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Time: <span className="font-medium text-foreground">
                    {startTime} - {endTime}
                  </span>
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-4 py-4 border-t shrink-0">
          <Button
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-base font-medium"
            onClick={handleSchedule}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Vote className="h-4 w-4 mr-2" />
                Schedule Primary
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
