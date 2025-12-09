import { useState } from "react";
import { CommunityFormData, CommunityEvent, EventNature, EventAttendance } from "@/types/communityForm";
import { eventNatureOptions } from "@/data/communityFormOptions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EventsActivitiesSectionProps {
  formData: CommunityFormData;
  addEvent: (event: CommunityEvent) => void;
  removeEvent: (eventId: string) => void;
  updateEvent: (eventId: string, updates: Partial<CommunityEvent>) => void;
  errors: Partial<Record<keyof CommunityFormData, string>>;
}

const defaultEventState: Partial<CommunityEvent> = {
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
};

export function EventsActivitiesSection({
  formData,
  addEvent,
  removeEvent,
  updateEvent,
  errors,
}: EventsActivitiesSectionProps) {
  const [showEventsList, setShowEventsList] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CommunityEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<CommunityEvent>>(defaultEventState);

  const handleEditEvent = (event: CommunityEvent) => {
    setEditingEvent(event);
    setNewEvent({
      name: event.name,
      nature: event.nature,
      approvedDues: event.approvedDues,
      contraventions: event.contraventions,
      contraventionCount: event.contraventionCount,
      timeframe: event.timeframe,
      validityDate: event.validityDate,
      attendance: event.attendance,
      penaltyAbsentPercent: event.penaltyAbsentPercent,
      penaltyOwingPercent: event.penaltyOwingPercent,
    });
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setNewEvent(defaultEventState);
  };

  const handleCreateOrUpdateEvent = () => {
    if (!newEvent.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Event name is required",
        variant: "destructive",
      });
      return;
    }

    if (editingEvent) {
      // Update existing event
      updateEvent(editingEvent.id, {
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
      });
      
      setEditingEvent(null);
      setNewEvent(defaultEventState);
      
      toast({
        title: "Event Updated",
        description: "Event has been updated successfully",
      });
    } else {
      // Create new event
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
      setNewEvent(defaultEventState);
      
      toast({
        title: "Event Created",
        description: "Event has been added successfully",
      });
    }
  };

  const formatSerialNumber = (index: number) => {
    return String(index + 1).padStart(2, "0");
  };

  const formatCurrency = (amount: number) => {
    return `N${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const calculatePenaltyAmount = (approvedDues: number, penaltyPercent: number) => {
    return (approvedDues * penaltyPercent) / 100;
  };

  return (
    <div className="space-y-5">
      {/* Create/Edit Event Form */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">
          {editingEvent ? `Edit Event: "${editingEvent.name}"` : "Create New Event/Activity"}
        </h3>

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

        <div className="flex gap-2">
          {editingEvent && (
            <Button type="button" variant="outline" onClick={handleCancelEdit} className="flex-1">
              Cancel
            </Button>
          )}
          <Button type="button" onClick={handleCreateOrUpdateEvent} className="flex-1">
            {editingEvent ? "Save Changes" : "Create Now"}
          </Button>
        </div>
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
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th rowSpan={2} className="border border-gray-600 p-3 text-left font-semibold">S/N</th>
                    <th rowSpan={2} className="border border-gray-600 p-3 text-left font-semibold">Events/Activities</th>
                    <th rowSpan={2} className="border border-gray-600 p-3 text-left font-semibold">Approved Annual Dues</th>
                    <th rowSpan={2} className="border border-gray-600 p-3 text-left font-semibold">Contravention/Offenses</th>
                    <th colSpan={2} className="border border-gray-600 p-3 text-center font-semibold">Penalties</th>
                    <th rowSpan={2} className="border border-gray-600 p-3 text-left font-semibold">Validity Date</th>
                    <th rowSpan={2} className="border border-gray-600 p-3 text-center font-semibold">Action</th>
                  </tr>
                  <tr>
                    <th className="border border-gray-600 p-3 text-left font-semibold">Owing</th>
                    <th className="border border-gray-600 p-3 text-left font-semibold">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.events.map((event, index) => (
                    <tr key={event.id} className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                      <td className="border border-border p-3">{formatSerialNumber(index)}</td>
                      <td className="border border-border p-3 font-medium">{event.name}</td>
                      <td className="border border-border p-3 text-yellow-500 font-semibold">
                        {formatCurrency(event.approvedDues)}
                      </td>
                      <td className="border border-border p-3">
                        <span className="text-cyan-400">{event.contraventions || "None"}</span>
                        {event.contraventionCount > 0 && (
                          <span className="text-red-500"> / {event.contraventionCount}</span>
                        )}
                      </td>
                      <td className="border border-border p-3 text-green-500 font-medium">
                        {event.penaltyOwingPercent}% of {formatCurrency(calculatePenaltyAmount(event.approvedDues, event.penaltyOwingPercent))}
                      </td>
                      <td className="border border-border p-3 text-red-500 font-semibold">
                        {formatCurrency(calculatePenaltyAmount(event.approvedDues, event.penaltyAbsentPercent))}
                      </td>
                      <td className="border border-border p-3 text-cyan-400">
                        {formatDate(event.validityDate)}
                      </td>
                      <td className="border border-border p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEvent(event)}
                          >
                            <Pencil className="h-4 w-4 text-primary" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
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
