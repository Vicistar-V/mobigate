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
  return (
    <Accordion type="single" collapsible className="w-full max-w-full">
      <AccordionItem value="meeting" className="border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-4 hover:no-underline max-w-full">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-teal-500/10 shrink-0">
              <Calendar className="h-5 w-5 text-teal-600" />
            </div>
            <div className="text-left min-w-0">
              <h3 className="font-semibold text-base truncate">Meetings</h3>
              <p className="text-sm text-muted-foreground truncate">
                {stats.scheduledMeetings} scheduled • {stats.avgAttendanceRate}% attendance
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4 w-full max-w-full overflow-hidden">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-1.5 w-full">
              <StatBadge value={stats.scheduledMeetings} label="Scheduled" icon={Clock} />
              <StatBadge value={stats.completedMeetings} label="Completed" icon={CheckCircle} />
              <StatBadge value={`${stats.avgAttendanceRate}%`} label="Attendance" icon={Users} />
            </div>

            {/* Attendance Progress */}
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Avg Attendance</span>
                <span className="text-sm font-bold text-teal-600">{stats.avgAttendanceRate}%</span>
              </div>
              <Progress value={stats.avgAttendanceRate} className="h-2" />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onViewUpcoming}>
                <Clock className="h-4 w-4 mr-2" />
                Upcoming
              </Button>
              <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onViewPast}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Past
              </Button>
              <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onViewAttendance}>
                <Users className="h-4 w-4 mr-2" />
                Attendance
              </Button>
              <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onViewResolutions}>
                <FileText className="h-4 w-4 mr-2" />
                Resolutions
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onViewConflicts}>
                <Scale className="h-4 w-4 mr-2" />
                Conflicts
                <Badge variant="secondary" className="ml-1 text-xs px-1.5">2</Badge>
              </Button>
              <Button variant="outline" size="sm" className="h-10 text-sm" onClick={onManageRollCall}>
                <Users className="h-4 w-4 mr-2" />
                Roll-Call
              </Button>
            </div>

            {/* Upcoming Meetings */}
            {upcomingMeetings.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-sm flex items-center justify-between">
                    Upcoming
                    <Button variant="ghost" size="sm" className="h-8 text-sm px-2" onClick={onViewUpcoming}>
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
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