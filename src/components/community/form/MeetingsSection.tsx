import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { CommunityFormData, MeetingSchedule } from "@/types/communityForm";
import { meetingFrequencyOptions, dayOfWeekOptions, weekOfMonthOptions, monthOfYearOptions } from "@/data/communityFormOptions";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MeetingsSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  addMeeting: (type: "general" | "executive", meeting: MeetingSchedule) => void;
  removeMeeting: (type: "general" | "executive", meetingId: string) => void;
  updateMeeting: (type: "general" | "executive", meetingId: string, updates: Partial<MeetingSchedule>) => void;
}

export function MeetingsSection({ 
  formData, 
  updateField, 
  addMeeting, 
  removeMeeting,
  updateMeeting 
}: MeetingsSectionProps) {
  const addNewMeeting = (type: "general" | "executive") => {
    const newMeeting: MeetingSchedule = {
      id: `meeting-${Date.now()}-${Math.random()}`,
      type,
      frequency: "monthly",
      weekOfMonth: "first",
      dayOfWeek: "saturday"
    };
    addMeeting(type, newMeeting);
  };

  const renderMeetingCard = (meeting: MeetingSchedule, type: "general" | "executive") => (
    <Card key={meeting.id} className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <Badge variant={type === "general" ? "default" : "secondary"}>
          {type === "general" ? "General Meeting" : "Executive Meeting"}
        </Badge>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => removeMeeting(type, meeting.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <div className="grid gap-3">
        <div className="space-y-2">
          <Label className="text-xs">Frequency</Label>
          <Select 
            value={meeting.frequency}
            onValueChange={(value) => updateMeeting(type, meeting.id, { frequency: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meetingFrequencyOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(meeting.frequency === "quarterly" || meeting.frequency === "bi-annually" || meeting.frequency === "annually") && (
          <div className="space-y-2">
            <Label className="text-xs">Month</Label>
            <Select 
              value={meeting.monthOfYear || "january"}
              onValueChange={(value) => updateMeeting(type, meeting.id, { monthOfYear: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOfYearOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {(meeting.frequency === "monthly" || meeting.frequency === "quarterly" || meeting.frequency === "bi-annually" || meeting.frequency === "annually") && (
          <div className="space-y-2">
            <Label className="text-xs">Week of Month</Label>
            <Select 
              value={meeting.weekOfMonth || "first"}
              onValueChange={(value) => updateMeeting(type, meeting.id, { weekOfMonth: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weekOfMonthOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs">Day of Week</Label>
          <Select 
            value={meeting.dayOfWeek}
            onValueChange={(value) => updateMeeting(type, meeting.id, { dayOfWeek: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dayOfWeekOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">General Meetings</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNewMeeting("general")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        {formData.generalMeetings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No general meetings configured</p>
        ) : (
          <div className="space-y-3">
            {formData.generalMeetings.map(meeting => renderMeetingCard(meeting, "general"))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Executive Meetings</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNewMeeting("executive")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        {formData.executiveMeetings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No executive meetings configured</p>
        ) : (
          <div className="space-y-3">
            {formData.executiveMeetings.map(meeting => renderMeetingCard(meeting, "executive"))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Attendance Register</Label>
          <p className="text-xs text-muted-foreground">Track meeting attendance</p>
        </div>
        <Switch
          checked={formData.attendanceRegister}
          onCheckedChange={(checked) => updateField("attendanceRegister", checked)}
        />
      </div>
    </div>
  );
}
