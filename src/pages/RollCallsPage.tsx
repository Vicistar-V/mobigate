import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { activeRollCall, rollCallHistory, type RollCall } from "@/data/rollCallsData";

export const RollCallsPage = () => {
  const [showMarkDialog, setShowMarkDialog] = useState(false);
  const [showAbsenceDialog, setShowAbsenceDialog] = useState(false);
  const [absenceReason, setAbsenceReason] = useState("");
  const { toast } = useToast();

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
    if (!currentRollCall) return;

    toast({
      title: "Attendance Marked",
      description: `You've successfully marked your attendance for ${currentRollCall.title}`,
    });
    setShowMarkDialog(false);
  };

  const handleSubmitAbsence = () => {
    if (!absenceReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for your absence",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Absence Reported",
      description: "Your absence has been recorded with the provided reason",
    });
    setAbsenceReason("");
    setShowAbsenceDialog(false);
  };

  const getStatusBadge = (status: RollCall["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Active Now</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-600">Scheduled</Badge>;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        <div className="container max-w-4xl mx-auto p-4 space-y-6">
          {/* Header */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Roll Calls</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Track attendance and participation in community activities
            </p>
          </Card>

          {/* Your Attendance Stats */}
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Award className="h-5 w-5" />
              Your Attendance Record
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{totalAttended}</div>
                <div className="text-xs text-muted-foreground">Attended</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {totalRollCalls - totalAttended}
                </div>
                <div className="text-xs text-muted-foreground">Missed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {attendanceRate.toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground">Rate</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Attendance Progress</span>
                <span className="text-muted-foreground">
                  {totalAttended} / {totalRollCalls}
                </span>
              </div>
              <Progress value={attendanceRate} className="h-2" />
            </div>

            {attendanceRate >= 75 && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                    Excellent Attendance!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    You're meeting the community participation requirements
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Current Roll Call */}
          {currentRollCall && (
            <Card className="p-6 space-y-4 border-2 border-primary">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">{currentRollCall.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {currentRollCall.description}
                  </p>
                </div>
                {getStatusBadge(currentRollCall.status)}
              </div>

              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Time Remaining</p>
                  <p className="text-xs text-muted-foreground">
                    Closes {formatDistanceToNow(currentRollCall.endTime, { addSuffix: true })}
                  </p>
                </div>
              </div>

              {/* Participation Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currentRollCall.attendedMembers}
                  </div>
                  <div className="text-xs text-muted-foreground">Present</div>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {currentRollCall.absentMembers}
                  </div>
                  <div className="text-xs text-muted-foreground">Absent</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={() => setShowMarkDialog(true)} className="flex-1">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Attendance
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAbsenceDialog(true)}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Report Absence
                </Button>
              </div>
            </Card>
          )}

          {/* Attendance History */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Attendance History
            </h2>

            {pastRollCalls.length > 0 ? (
              pastRollCalls.map((rollCall) => (
                <Card key={rollCall.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{rollCall.title}</h3>
                        {userAttendedRollCallIds.includes(rollCall.id) ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rollCall.description}
                      </p>
                    </div>
                    {getStatusBadge(rollCall.status)}
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {rollCall.attendedMembers} present
                      </span>
                      <span className="flex items-center gap-1">
                        <XCircle className="h-4 w-4 text-red-600" />
                        {rollCall.absentMembers} absent
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(rollCall.endTime, { addSuffix: true })}
                    </span>
                  </div>

                  {/* Your Status */}
                  <div
                    className={`p-2 rounded text-sm font-medium text-center ${
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
              <Card className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium">No roll call history</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your attendance records will appear here
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Mark Attendance Dialog */}
      <Dialog open={showMarkDialog} onOpenChange={setShowMarkDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Attendance</DialogTitle>
          </DialogHeader>

          {currentRollCall && (
            <div className="space-y-4">
              <Card className="p-4 bg-muted">
                <h3 className="font-semibold mb-1">{currentRollCall.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentRollCall.description}
                </p>
              </Card>

              <p className="text-sm text-muted-foreground">
                By confirming, you're marking your attendance for this roll call. This
                action cannot be undone.
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowMarkDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleMarkAttendance} className="flex-1">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Absence Dialog */}
      <Dialog open={showAbsenceDialog} onOpenChange={setShowAbsenceDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Absence</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reason for Absence</Label>
              <Textarea
                placeholder="Please explain why you cannot attend..."
                value={absenceReason}
                onChange={(e) => setAbsenceReason(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Providing a valid reason helps maintain good standing in the community
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAbsenceDialog(false);
                  setAbsenceReason("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitAbsence} className="flex-1">
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
