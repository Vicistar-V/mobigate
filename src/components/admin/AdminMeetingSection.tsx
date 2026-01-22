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
  <div className="flex items-center gap-2 py-2">
    <div className="p-1.5 rounded-lg bg-teal-500/10 shrink-0">
      <Video className="h-3.5 w-3.5 text-teal-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-xs truncate">{meeting.title}</p>
      <p className="text-[10px] text-muted-foreground">
        {formatFutureTime(meeting.date)}
      </p>
    </div>
    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 shrink-0" onClick={() => onView(meeting.id)}>
      View
      <ChevronRight className="h-3 w-3 ml-0.5" />
    </Button>
  </div>
);

interface StatBadgeProps {
  value: number | string;
  label: string;
  icon: React.ElementType;
}

const StatBadge = ({ value, label, icon: Icon }: StatBadgeProps) => (
  <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50 min-w-0">
    <Icon className="h-3.5 w-3.5 text-muted-foreground mb-0.5" />
    <span className="text-base sm:text-lg font-bold">{value}</span>
    <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate">{label}</span>
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
      <AccordionItem value="meeting" className="border rounded-lg overflow-hidden">
        <AccordionTrigger className="px-3 hover:no-underline">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-teal-500/10 shrink-0">
              <Calendar className="h-4 w-4 text-teal-600" />
            </div>
            <div className="text-left min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">Meetings</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {stats.scheduledMeetings} scheduled • {stats.avgAttendanceRate}% attendance
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <div className="space-y-3 w-full overflow-hidden">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-1.5 w-full">
              <StatBadge value={stats.scheduledMeetings} label="Scheduled" icon={Clock} />
              <StatBadge value={stats.completedMeetings} label="Completed" icon={CheckCircle} />
              <StatBadge value={`${stats.avgAttendanceRate}%`} label="Attendance" icon={Users} />
            </div>

            {/* Attendance Progress */}
            <div className="p-2.5 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium">Avg Attendance</span>
                <span className="text-xs font-bold text-teal-600">{stats.avgAttendanceRate}%</span>
              </div>
              <Progress value={stats.avgAttendanceRate} className="h-1.5" />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-1.5">
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onViewUpcoming}>
                <Clock className="h-3 w-3 mr-1" />
                Upcoming
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onViewPast}>
                <CheckCircle className="h-3 w-3 mr-1" />
                Past
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onViewAttendance}>
                <Users className="h-3 w-3 mr-1" />
                Attendance
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onViewResolutions}>
                <FileText className="h-3 w-3 mr-1" />
                Resolutions
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onViewConflicts}>
                <Scale className="h-3 w-3 mr-1" />
                Conflicts
                <Badge variant="secondary" className="ml-1 text-[8px] px-1">2</Badge>
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={onManageRollCall}>
                <Users className="h-3 w-3 mr-1" />
                Roll-Call
              </Button>
            </div>

            {/* Upcoming Meetings */}
            {upcomingMeetings.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-1.5 pt-2.5 px-2.5">
                  <CardTitle className="text-xs flex items-center justify-between">
                    Upcoming
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={onViewUpcoming}>
                      View All
                      <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2.5 pb-2.5 pt-0">
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
