import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Clock,
  CheckCircle,
  Users,
  FileText,
  Scale,
  Calendar,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Award,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

// Import existing meeting components and data
import { UpcomingSchedulesList } from "@/components/community/meetings/UpcomingSchedulesList";
import { PreviousMeetingsList } from "@/components/community/meetings/PreviousMeetingsList";
import { MeetingAttendanceTab } from "@/components/community/meetings/MeetingAttendanceTab";
import { MeetingResolutionsTab } from "@/components/community/meetings/MeetingResolutionsTab";
import { MeetingConflictsTab } from "@/components/community/meetings/MeetingConflictsTab";
import { 
  mockMeetings, 
  mockUpcomingMeetings as meetingsMockUpcoming 
} from "@/data/meetingsData";
import { 
  activeRollCall, 
  rollCallHistory, 
  type RollCall 
} from "@/data/rollCallsData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ============== AdminUpcomingMeetingsSheet ==============
export function AdminUpcomingMeetingsSheet({ open, onOpenChange }: SheetProps) {
  const handleSelectSchedule = (item: any) => {
    console.log("Selected schedule:", item);
  };

  // Combine upcoming meetings from both sources
  const allUpcoming = [...meetingsMockUpcoming, ...mockMeetings.filter(m => m.status === "upcoming")];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Upcoming Meetings
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 h-[calc(92vh-60px)] overflow-y-auto touch-auto">
          <div className="pb-6">
            <UpcomingSchedulesList 
              meetings={allUpcoming} 
              onSelectSchedule={handleSelectSchedule} 
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ============== AdminPastMeetingsSheet ==============
export function AdminPastMeetingsSheet({ open, onOpenChange }: SheetProps) {
  const handleSelectMeeting = (meeting: any) => {
    console.log("Selected meeting:", meeting);
  };

  const completedMeetings = mockMeetings.filter(m => m.status === "completed");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Past Meetings
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 h-[calc(92vh-60px)] overflow-y-auto touch-auto">
          <div className="pb-6">
            <PreviousMeetingsList 
              meetings={completedMeetings} 
              onSelectMeeting={handleSelectMeeting} 
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ============== AdminAttendanceSheet ==============
export function AdminAttendanceSheet({ open, onOpenChange }: SheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Attendance Records
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 h-[calc(92vh-60px)] overflow-y-auto touch-auto">
          <div className="px-4 py-4 pb-6">
            <MeetingAttendanceTab />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ============== AdminResolutionsSheet ==============
export function AdminResolutionsSheet({ open, onOpenChange }: SheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Meeting Resolutions
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 h-[calc(92vh-60px)] overflow-y-auto touch-auto">
          <div className="px-4 py-4 pb-6">
            <MeetingResolutionsTab />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ============== AdminConflictsSheet ==============
export function AdminConflictsSheet({ open, onOpenChange }: SheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Conflicts & Disputes
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 h-[calc(92vh-60px)] overflow-y-auto touch-auto">
          <div className="px-4 py-4 pb-6">
            <MeetingConflictsTab />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ============== AdminRollCallSheet ==============
// Custom mobile-optimized roll call management for admin
export function AdminRollCallSheet({ open, onOpenChange }: SheetProps) {
  const { toast } = useToast();
  const [showAbsenceReason, setShowAbsenceReason] = useState(false);
  const [absenceReason, setAbsenceReason] = useState("");

  const currentRollCall = activeRollCall;
  const pastRollCalls = rollCallHistory;

  // Mock user attendance data (in real app, would come from backend)
  const userAttendedRollCallIds = ["rollcall-1", "rollcall-2", "rollcall-5"];

  // Calculate stats
  const totalAttended = pastRollCalls.filter((rc) =>
    userAttendedRollCallIds.includes(rc.id)
  ).length;
  const totalRollCalls = pastRollCalls.length;
  const attendanceRate = totalRollCalls > 0 ? (totalAttended / totalRollCalls) * 100 : 0;

  const handleMarkAttendance = () => {
    toast({
      title: "Attendance Marked",
      description: `Successfully marked attendance for ${currentRollCall.title}`,
    });
  };

  const handleReportAbsence = () => {
    if (!absenceReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for absence",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Absence Reported",
      description: "Absence recorded with the provided reason",
    });
    setAbsenceReason("");
    setShowAbsenceReason(false);
  };

  const getStatusBadge = (status: RollCall["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600 text-white text-[10px]">Active</Badge>;
      case "completed":
        return <Badge variant="secondary" className="text-[10px]">Completed</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-600 text-white text-[10px]">Scheduled</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] rounded-t-2xl p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Roll-Call Management
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 h-[calc(92vh-60px)] overflow-y-auto touch-auto">
          <div className="px-4 py-4 pb-6 space-y-4">
            {/* Attendance Stats Card */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-sm">Your Attendance Record</h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-green-500/10 rounded-lg">
                  <div className="text-xl font-bold text-green-600">{totalAttended}</div>
                  <div className="text-[10px] text-muted-foreground">Attended</div>
                </div>
                <div className="text-center p-2 bg-red-500/10 rounded-lg">
                  <div className="text-xl font-bold text-red-600">
                    {totalRollCalls - totalAttended}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Missed</div>
                </div>
                <div className="text-center p-2 bg-primary/10 rounded-lg">
                  <div className="text-xl font-bold text-primary">
                    {attendanceRate.toFixed(0)}%
                  </div>
                  <div className="text-[10px] text-muted-foreground">Rate</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">Progress</span>
                  <span className="text-muted-foreground">
                    {totalAttended} / {totalRollCalls}
                  </span>
                </div>
                <Progress value={attendanceRate} className="h-2" />
              </div>

              {attendanceRate >= 75 && (
                <div className="flex items-center gap-2 p-2.5 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <Award className="h-4 w-4 text-green-600 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-green-900 dark:text-green-100">
                      Excellent Attendance!
                    </p>
                    <p className="text-[10px] text-green-700 dark:text-green-300">
                      Meeting community participation requirements
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Active Roll Call */}
            {currentRollCall && (
              <Card className="p-4 space-y-3 border-2 border-primary">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm leading-tight">{currentRollCall.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {currentRollCall.description}
                    </p>
                  </div>
                  {getStatusBadge(currentRollCall.status)}
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-primary/10 rounded-lg">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">Time Remaining</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date() < currentRollCall.endTime
                        ? `Closes in ${formatDistanceToNow(currentRollCall.endTime)}`
                        : `Closed ${formatDistanceToNow(currentRollCall.endTime, { addSuffix: true })}`}
                    </p>
                  </div>
                </div>

                {/* Participation Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-muted rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600">
                      {currentRollCall.attendedMembers}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Present</div>
                  </div>
                  <div className="p-2.5 bg-muted rounded-lg text-center">
                    <div className="text-lg font-bold text-red-600">
                      {currentRollCall.absentMembers}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Absent</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <Button onClick={handleMarkAttendance} className="w-full">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark Attendance
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAbsenceReason(!showAbsenceReason)}
                    className="w-full"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Report Absence
                  </Button>
                </div>

                {/* Absence Reason Input */}
                {showAbsenceReason && (
                  <div className="space-y-2 pt-2 border-t">
                    <Label className="text-xs">Reason for Absence</Label>
                    <Textarea
                      placeholder="Please explain why you cannot attend..."
                      value={absenceReason}
                      onChange={(e) => setAbsenceReason(e.target.value)}
                      className="min-h-[80px] touch-manipulation"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button onClick={handleReportAbsence} size="sm" className="w-full">
                      Submit Absence Report
                    </Button>
                  </div>
                )}
              </Card>
            )}

            {/* Roll Call History */}
            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Attendance History
              </h3>

              {pastRollCalls.length > 0 ? (
                pastRollCalls.map((rollCall) => (
                  <Card key={rollCall.id} className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-semibold text-sm leading-tight truncate">{rollCall.title}</h4>
                          {userAttendedRollCallIds.includes(rollCall.id) ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">
                          {rollCall.description}
                        </p>
                      </div>
                      {getStatusBadge(rollCall.status)}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          {rollCall.attendedMembers}
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-red-600" />
                          {rollCall.absentMembers}
                        </span>
                      </div>
                      <span className="text-[10px]">
                        {formatDistanceToNow(rollCall.endTime, { addSuffix: true })}
                      </span>
                    </div>

                    {/* Your Status */}
                    <div
                      className={`p-1.5 rounded text-[10px] font-medium text-center ${
                        userAttendedRollCallIds.includes(rollCall.id)
                          ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                          : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
                      }`}
                    >
                      {userAttendedRollCallIds.includes(rollCall.id)
                        ? "You attended"
                        : "You were absent"}
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <Calendar className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">No roll call history</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your attendance records will appear here
                  </p>
                </Card>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
