import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CommunityFormData, MeetingSchedule } from "@/types/communityForm";
import { meetingFrequencyOptions, dayOfWeekOptions, weekOfMonthOptions, monthOfYearOptions } from "@/data/communityFormOptions";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface MeetingsSectionProps {
  formData: CommunityFormData;
  updateField: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  addMeeting: (type: "general" | "executive" | "custom", meeting: MeetingSchedule) => void;
  removeMeeting: (type: "general" | "executive" | "custom", meetingId: string) => void;
  updateMeeting: (type: "general" | "executive" | "custom", meetingId: string, updates: Partial<MeetingSchedule>) => void;
}

export function MeetingsSection({ 
  formData, 
  updateField, 
  addMeeting, 
  removeMeeting,
  updateMeeting 
}: MeetingsSectionProps) {
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);

  const addNewMeeting = (type: "general" | "executive" | "custom") => {
    const newMeeting: MeetingSchedule = {
      id: `meeting-${Date.now()}-${Math.random()}`,
      type,
      customTypeName: type === "custom" ? "New Meeting" : undefined,
      frequency: "monthly",
      weekOfMonth: "first",
      dayOfWeek: "saturday"
    };
    addMeeting(type, newMeeting);
    if (type === "custom") {
      setEditingMeetingId(newMeeting.id);
    }
  };

  const renderMeetingCard = (meeting: MeetingSchedule, type: "general" | "executive" | "custom") => {
    const isEditing = editingMeetingId === meeting.id;
    
    return (
    <Card key={meeting.id} className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        {type === "custom" ? (
          isEditing ? (
            <Input
              value={meeting.customTypeName || ""}
              onChange={(e) => updateMeeting(type, meeting.id, { customTypeName: e.target.value })}
              onBlur={() => setEditingMeetingId(null)}
              onKeyDown={(e) => e.key === "Enter" && setEditingMeetingId(null)}
              className="h-8 w-40 text-sm font-medium"
              placeholder="Meeting name"
              autoFocus
            />
          ) : (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {meeting.customTypeName || "Custom Meeting"}
            </Badge>
          )
        ) : (
          <Badge variant={type === "general" ? "default" : "secondary"}>
            {type === "general" ? "General Meeting" : "Executive Meeting"}
          </Badge>
        )}
        <div className="flex items-center gap-1">
          {type === "custom" && !isEditing && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setEditingMeetingId(meeting.id)}
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => removeMeeting(type, meeting.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
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
            <SelectContent className="bg-background border z-50">
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
              <SelectContent className="bg-background border z-50">
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
              <SelectContent className="bg-background border z-50">
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
            <SelectContent className="bg-background border z-50">
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
  };

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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Custom Meetings</Label>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => addNewMeeting("custom")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Create Meeting
          </Button>
        </div>
        
        {formData.customMeetings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No custom meetings configured</p>
        ) : (
          <div className="space-y-3">
            {formData.customMeetings.map(meeting => renderMeetingCard(meeting, "custom"))}
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
