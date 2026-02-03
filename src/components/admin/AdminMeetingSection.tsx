import { useState } from "react";
import { Calendar, Users, CheckCircle, Clock, FileText, Scale, ChevronRight, Video, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdminMinutesSettings } from "./settings/AdminMinutesSettings";
import { AdminStats, UpcomingMeeting, formatFutureTime } from "@/data/adminDashboardData";

interface MeetingItemProps {
  meeting: UpcomingMeeting;
  onView: (id: string) => void;
}

const MeetingItem = ({ meeting, onView }: MeetingItemProps) => (
  <div className="py-3 space-y-1.5">
    {/* Row 1: Icon + Title + Date */}
    <div className="flex items-start gap-2.5">
      <div className="p-1.5 rounded-md bg-teal-500/10 shrink-0 mt-0.5">
        <Video className="h-3.5 w-3.5 text-teal-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm leading-snug line-clamp-1">{meeting.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatFutureTime(meeting.date)}
        </p>
      </div>
    </div>
    {/* Row 2: Action link */}
    <div className="flex items-center gap-3 pl-8 text-xs">
      <button 
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => onView(meeting.id)}
      >
        View
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  </div>
);

interface StatBadgeProps {
  value: number | string;
  label: string;
  icon: React.ElementType;
}

const StatBadge = ({ value, label, icon: Icon }: StatBadgeProps) => (
  <div className="flex flex-col items-center justify-center py-2">
    <span className="text-base font-bold leading-none">{value}</span>
    <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
  </div>
);

interface AdminMeetingSectionProps {
  stats: AdminStats;
  upcomingMeetings: UpcomingMeeting[];
  onViewUpcoming: () => void;
  onViewPast: () => void;
  onViewAttendance: () => void;
  onViewResolutions: () => void;
  onViewConflicts: () => void;
  onManageRollCall: () => void;
}

export function AdminMeetingSection({
  stats,
  upcomingMeetings,
  onViewUpcoming,
  onViewPast,
  onViewAttendance,
  onViewResolutions,
  onViewConflicts,
  onManageRollCall,
}: AdminMeetingSectionProps) {
  const [showMinutesSettings, setShowMinutesSettings] = useState(false);

  return (
    <>
      <AdminMinutesSettings
        open={showMinutesSettings}
        onOpenChange={setShowMinutesSettings}
      />
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="meeting" className="border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-3 hover:no-underline">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="p-1.5 rounded-lg bg-teal-500/10 shrink-0">
              <Calendar className="h-4 w-4 text-teal-600" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <h3 className="font-semibold text-sm">Meetings</h3>
              <p className="text-xs text-muted-foreground">
                {stats.scheduledMeetings} scheduled • {stats.avgAttendanceRate}% attendance
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <div className="space-y-3">
            {/* Stats - inline row */}
            <div className="flex items-center justify-start gap-6 py-1">
              <StatBadge value={stats.scheduledMeetings} label="Scheduled" icon={Clock} />
              <StatBadge value={stats.completedMeetings} label="Completed" icon={CheckCircle} />
              <StatBadge value={`${stats.avgAttendanceRate}%`} label="Attendance" icon={Users} />
            </div>

            {/* Attendance Progress */}
            <div className="p-2.5 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium">Avg Attendance</span>
                <span className="text-xs font-bold text-teal-600">{stats.avgAttendanceRate}%</span>
              </div>
              <Progress value={stats.avgAttendanceRate} className="h-1.5" />
            </div>

            {/* Action Buttons - list style with dividers */}
            <div className="flex flex-col gap-0 divide-y divide-border">
              <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onViewUpcoming}>
                <Clock className="h-4 w-4 text-muted-foreground" />
                Upcoming Meetings
              </button>
              <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onViewPast}>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                Past Meetings
              </button>
              <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onViewAttendance}>
                <Users className="h-4 w-4 text-muted-foreground" />
                Attendance Records
              </button>
              <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onViewResolutions}>
                <FileText className="h-4 w-4 text-muted-foreground" />
                Resolutions
              </button>
              <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onViewConflicts}>
                <Scale className="h-4 w-4 text-muted-foreground" />
                Conflicts & Disputes
              </button>
              <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={onManageRollCall}>
                <Users className="h-4 w-4 text-muted-foreground" />
                Roll-Call Management
              </button>
              <button className="flex items-center gap-3 py-2.5 text-sm hover:bg-muted/50 -mx-1 px-1 rounded" onClick={() => setShowMinutesSettings(true)}>
                <Settings className="h-4 w-4 text-muted-foreground" />
                Minutes Settings
              </button>
            </div>

            {/* Upcoming Meetings */}
            {upcomingMeetings.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Upcoming</p>
                <div className="divide-y divide-border/50">
                  {upcomingMeetings.slice(0, 3).map((meeting) => (
                    <MeetingItem 
                      key={meeting.id} 
                      meeting={meeting} 
                      onView={(id) => {}} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    </>
  );
}