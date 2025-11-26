import { useState } from "react";
import { CommunityFormData, CommunityEvent, EventNature, EventAttendance } from "@/types/communityForm";
import { eventNatureOptions } from "@/data/communityFormOptions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EventsActivitiesSectionProps {
  formData: CommunityFormData;
  addEvent: (event: CommunityEvent) => void;
  removeEvent: (eventId: string) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

export function EventsActivitiesSection({
  formData,
  addEvent,
  removeEvent,
  errors,
}: EventsActivitiesSectionProps) {
  const [showEventsList, setShowEventsList] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CommunityEvent>>({
    name: "",
    nature: "cultural",
    approvedDues: 0,
    contraventions: "",
    contraventionCount: 0,
    timeframe: "",
    validityDate: "",
    attendance: "voluntary",
    penaltyAbsentPercent: 0,
    penaltyOwingPercent: 0,
  });

  const handleCreateEvent = () => {
    if (!newEvent.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Event name is required",
        variant: "destructive",
      });
      return;
    }

    const event: CommunityEvent = {
      id: `event-${Date.now()}`,
      name: newEvent.name,
      nature: (newEvent.nature as EventNature) || "cultural",
      approvedDues: newEvent.approvedDues || 0,
      contraventions: newEvent.contraventions || "",
      contraventionCount: newEvent.contraventionCount || 0,
      timeframe: newEvent.timeframe || "",
      validityDate: newEvent.validityDate || "",
      attendance: (newEvent.attendance as EventAttendance) || "voluntary",
      penaltyAbsentPercent: newEvent.penaltyAbsentPercent || 0,
      penaltyOwingPercent: newEvent.penaltyOwingPercent || 0,
    };

    addEvent(event);
    
    // Reset form
    setNewEvent({
      name: "",
      nature: "cultural",
      approvedDues: 0,
      contraventions: "",
      contraventionCount: 0,
      timeframe: "",
      validityDate: "",
      attendance: "voluntary",
      penaltyAbsentPercent: 0,
      penaltyOwingPercent: 0,
    });

    toast({
      title: "Event Created",
      description: "Event has been added successfully",
    });
  };

  const formatSerialNumber = (index: number) => {
    return String(index + 1).padStart(2, "0");
  };

  return (
    <div className="space-y-6">
      {/* Create New Event Form */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Create New Event/Activity</h3>

        <div className="space-y-2">
          <Label htmlFor="event-name">Event Name</Label>
          <Input
            id="event-name"
            placeholder="Enter event name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-nature">Nature of Event</Label>
          <Select
            value={newEvent.nature}
            onValueChange={(value) => setNewEvent({ ...newEvent, nature: value as EventNature })}
          >
            <SelectTrigger id="event-nature">
              <SelectValue placeholder="Select nature" />
            </SelectTrigger>
            <SelectContent>
              {eventNatureOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="approved-dues">Approved Dues Amount</Label>
          <Input
            id="approved-dues"
            type="number"
            min="0"
            placeholder="0"
            value={newEvent.approvedDues}
            onChange={(e) => setNewEvent({ ...newEvent, approvedDues: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contraventions">Contraventions & Offences</Label>
          <Input
            id="contraventions"
            placeholder="Enter contraventions"
            value={newEvent.contraventions}
            onChange={(e) => setNewEvent({ ...newEvent, contraventions: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contravention-count">Number of Contraventions</Label>
          <Input
            id="contravention-count"
            type="number"
            min="0"
            placeholder="0"
            value={newEvent.contraventionCount}
            onChange={(e) => setNewEvent({ ...newEvent, contraventionCount: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeframe">Timeframe</Label>
          <Input
            id="timeframe"
            placeholder="e.g., Annually, Quarterly"
            value={newEvent.timeframe}
            onChange={(e) => setNewEvent({ ...newEvent, timeframe: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="validity-date">Validity Date</Label>
          <Input
            id="validity-date"
            type="date"
            value={newEvent.validityDate}
            onChange={(e) => setNewEvent({ ...newEvent, validityDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Attendance</Label>
          <RadioGroup
            value={newEvent.attendance}
            onValueChange={(value) => setNewEvent({ ...newEvent, attendance: value as EventAttendance })}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mandatory" id="attendance-mandatory" />
              <Label htmlFor="attendance-mandatory">Mandatory</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="voluntary" id="attendance-voluntary" />
              <Label htmlFor="attendance-voluntary">Voluntary</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="penalty-absent">Penalty for Absentees (%)</Label>
          <Input
            id="penalty-absent"
            type="number"
            min="0"
            max="100"
            placeholder="0"
            value={newEvent.penaltyAbsentPercent}
            onChange={(e) => setNewEvent({ ...newEvent, penaltyAbsentPercent: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="penalty-owing">Penalty for Owing (%)</Label>
          <Input
            id="penalty-owing"
            type="number"
            min="0"
            max="100"
            placeholder="0"
            value={newEvent.penaltyOwingPercent}
            onChange={(e) => setNewEvent({ ...newEvent, penaltyOwingPercent: Number(e.target.value) })}
          />
        </div>

        <Button type="button" onClick={handleCreateEvent} className="w-full">
          Create Now
        </Button>
      </div>

      {/* Events List */}
      {formData.events.length > 0 && (
        <div className="space-y-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowEventsList(!showEventsList)}
            className="w-full justify-between"
          >
            <span className="text-sm font-medium">
              View Events List ({formData.events.length})
            </span>
            {showEventsList ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {showEventsList && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">S/N</th>
                    <th className="text-left p-2">Event Name</th>
                    <th className="text-left p-2">Nature</th>
                    <th className="text-left p-2">Dues</th>
                    <th className="text-left p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.events.map((event, index) => (
                    <tr key={event.id} className="border-b">
                      <td className="p-2">{formatSerialNumber(index)}</td>
                      <td className="p-2">{event.name}</td>
                      <td className="p-2 capitalize">{event.nature}</td>
                      <td className="p-2">{event.approvedDues}</td>
                      <td className="p-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
