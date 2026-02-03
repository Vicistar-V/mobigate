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
  <div className="flex items-center gap-3 py-3">
    <div className="p-2 rounded-lg bg-teal-500/10 shrink-0">
      <Video className="h-4 w-4 text-teal-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm truncate">{meeting.title}</p>
      <p className="text-sm text-muted-foreground">
        {formatFutureTime(meeting.date)}
      </p>
    </div>
    <Button variant="ghost" size="sm" className="h-8 text-sm px-2 shrink-0" onClick={() => onView(meeting.id)}>
      View
      <ChevronRight className="h-4 w-4 ml-1" />
    </Button>
  </div>
);

interface StatBadgeProps {
  value: number | string;
  label: string;
  icon: React.ElementType;
}

const StatBadge = ({ value, label, icon: Icon }: StatBadgeProps) => (
  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 min-w-0 overflow-hidden">
    <Icon className="h-3.5 w-3.5 text-muted-foreground mb-0.5" />
    <span className="text-base font-bold">{value}</span>
    <span className="text-xs text-muted-foreground truncate w-full text-center">{label}</span>
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
        <AccordionContent className="px-2.5 pb-2.5">
          <div className="space-y-2.5">
            {/* Stats Row - 3 columns */}
            <div className="grid grid-cols-3 gap-1.5">
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

            {/* Action Buttons - Stacked full width */}
            <div className="flex flex-col gap-1.5">
              <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-start" onClick={onViewUpcoming}>
                <Clock className="h-3.5 w-3.5 mr-2 shrink-0" />
                Upcoming Meetings
              </Button>
              <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-start" onClick={onViewPast}>
                <CheckCircle className="h-3.5 w-3.5 mr-2 shrink-0" />
                Past Meetings
              </Button>
              <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-start" onClick={onViewAttendance}>
                <Users className="h-3.5 w-3.5 mr-2 shrink-0" />
                Attendance Records
              </Button>
              <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-start" onClick={onViewResolutions}>
                <FileText className="h-3.5 w-3.5 mr-2 shrink-0" />
                Resolutions
              </Button>
              <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-between" onClick={onViewConflicts}>
                <span className="flex items-center">
                  <Scale className="h-3.5 w-3.5 mr-2 shrink-0" />
                  Conflicts & Disputes
                </span>
                <Badge variant="secondary" className="text-[10px] px-1.5 h-4 ml-2">2</Badge>
              </Button>
              <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-start" onClick={onManageRollCall}>
                <Users className="h-3.5 w-3.5 mr-2 shrink-0" />
                Roll-Call Management
              </Button>
              <Button variant="outline" size="sm" className="w-full h-9 text-xs justify-start" onClick={() => setShowMinutesSettings(true)}>
                <Settings className="h-3.5 w-3.5 mr-2 shrink-0" />
                Minutes Settings
              </Button>
            </div>

            {/* Upcoming Meetings */}
            {upcomingMeetings.length > 0 && (
              <Card className="border-0 shadow-none bg-muted/30">
                <CardHeader className="p-2.5 pb-1">
                  <CardTitle className="text-xs flex items-center justify-between">
                    <span>Upcoming</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs px-1.5 -mr-1" onClick={onViewUpcoming}>
                      View All
                      <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2.5 pt-0">
                  <div className="divide-y divide-border/50">
                    {upcomingMeetings.slice(0, 3).map((meeting) => (
                      <MeetingItem 
                        key={meeting.id} 
                        meeting={meeting} 
                        onView={(id) => {}} 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    </>
  );
}