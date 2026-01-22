import { Calendar, Users, CheckCircle, Clock, FileText, Scale, ChevronRight, Video } from "lucide-react";
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
import { AdminStats, UpcomingMeeting, formatFutureTime } from "@/data/adminDashboardData";

interface MeetingItemProps {
  meeting: UpcomingMeeting;
  onView: (id: string) => void;
}

const MeetingItem = ({ meeting, onView }: MeetingItemProps) => (
  <div className="flex items-center gap-3 py-2.5">
    <div className="p-2 rounded-lg bg-teal-500/10 shrink-0">
      <Video className="h-4 w-4 text-teal-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm truncate">{meeting.title}</p>
      <p className="text-xs text-muted-foreground">
        {formatFutureTime(meeting.date)}
      </p>
    </div>
    <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={() => onView(meeting.id)}>
      View
      <ChevronRight className="h-3 w-3 ml-1" />
    </Button>
  </div>
);

interface StatBadgeProps {
  value: number | string;
  label: string;
  icon: React.ElementType;
}

const StatBadge = ({ value, label, icon: Icon }: StatBadgeProps) => (
  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
    <Icon className="h-4 w-4 text-muted-foreground mb-1" />
    <span className="text-lg font-bold">{value}</span>
    <span className="text-[10px] text-muted-foreground">{label}</span>
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
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="meeting" className="border rounded-lg">
        <AccordionTrigger className="px-4 hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10">
              <Calendar className="h-4 w-4 text-teal-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Meeting Management</h3>
              <p className="text-xs text-muted-foreground">
                {stats.scheduledMeetings} scheduled • {stats.avgAttendanceRate}% avg attendance
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2">
              <StatBadge value={stats.scheduledMeetings} label="Scheduled" icon={Clock} />
              <StatBadge value={stats.completedMeetings} label="Completed" icon={CheckCircle} />
              <StatBadge value={`${stats.avgAttendanceRate}%`} label="Attendance" icon={Users} />
            </div>

            {/* Attendance Progress */}
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Average Attendance Rate</span>
                <span className="text-sm font-bold text-teal-600">{stats.avgAttendanceRate}%</span>
              </div>
              <Progress value={stats.avgAttendanceRate} className="h-2" />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={onViewUpcoming}>
                <Clock className="h-4 w-4 mr-2" />
                Upcoming
              </Button>
              <Button variant="outline" size="sm" onClick={onViewPast}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Past Meetings
              </Button>
              <Button variant="outline" size="sm" onClick={onViewAttendance}>
                <Users className="h-4 w-4 mr-2" />
                Attendance
              </Button>
              <Button variant="outline" size="sm" onClick={onViewResolutions}>
                <FileText className="h-4 w-4 mr-2" />
                Resolutions
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={onViewConflicts}>
                <Scale className="h-4 w-4 mr-2" />
                Conflicts
                <Badge variant="secondary" className="ml-1 text-[10px] px-1">2</Badge>
              </Button>
              <Button variant="outline" size="sm" onClick={onManageRollCall}>
                <Users className="h-4 w-4 mr-2" />
                Roll-Call
              </Button>
            </div>

            {/* Upcoming Meetings */}
            {upcomingMeetings.length > 0 && (
              <Card>
                <CardHeader className="pb-2 pt-3 px-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    Upcoming Meetings
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onViewUpcoming}>
                      View All
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3 pt-0">
                  <div className="divide-y divide-border">
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
  );
}
