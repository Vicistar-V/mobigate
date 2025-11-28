import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  ChevronRight,
  Table,
  List,
} from "lucide-react";
import { mockAttendance, mockMeetings } from "@/data/meetingsData";
import { format } from "date-fns";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { useState } from "react";
import { VoteBoxGroup } from "../shared/VoteBoxGroup";

export const MeetingAttendanceTab = () => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "table">("table");
  const itemsPerPage = 5;

  // Get completed meetings
  const completedMeetings = mockMeetings.filter((m) => m.status === "completed");

  const totalPages = Math.ceil(completedMeetings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedMeetings = completedMeetings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const selectedMeeting = mockMeetings.find((m) => m.id === selectedMeetingId);
  const meetingAttendance = mockAttendance.filter(
    (a) => a.meetingId === selectedMeetingId
  );

  const filteredAttendance =
    statusFilter === "all"
      ? meetingAttendance
      : meetingAttendance.filter((a) => a.status === statusFilter);

  const premiumAdSlots = [
    {
      slotId: "attendance-ad-1",
      ads: [
        {
          id: "attendance-ad-1",
          advertiser: {
            name: "Attendance Tracker Pro",
            verified: true,
          },
          content: {
            headline: "Never Miss an Attendance Record",
            description: "Automated attendance tracking for meetings and events.",
            ctaText: "Try Free",
            ctaUrl: "https://example.com",
          },
          media: {
            type: "image" as const,
            items: [
              {
                url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
              },
            ],
          },
          layout: "standard" as const,
          duration: 15,
        },
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-green-500/10 text-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Present
          </Badge>
        );
      case "absent":
        return (
          <Badge className="bg-red-500/10 text-red-500">
            <XCircle className="h-3 w-3 mr-1" />
            Absent
          </Badge>
        );
      case "late":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Late
          </Badge>
        );
      case "excused":
        return (
          <Badge className="bg-blue-500/10 text-blue-500">
            <AlertCircle className="h-3 w-3 mr-1" />
            Excused
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "border-green-600 bg-green-50";
      case "absent":
        return "border-red-600 bg-red-50";
      case "late":
        return "border-yellow-500 bg-yellow-50";
      case "excused":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-300";
    }
  };

  const calculateStats = () => {
    const total = meetingAttendance.length;
    const present = meetingAttendance.filter((a) => a.status === "present").length;
    const late = meetingAttendance.filter((a) => a.status === "late").length;
    const absent = meetingAttendance.filter((a) => a.status === "absent").length;
    const excused = meetingAttendance.filter((a) => a.status === "excused").length;

    return { total, present, late, absent, excused };
  };

  const handleExport = () => {
    if (!selectedMeeting) return;

    const exportData = [
      `Attendance Report - ${selectedMeeting.name}`,
      `Date: ${format(selectedMeeting.date, "MMMM dd, yyyy")}`,
      `\n`,
      `Member,Position,Status,Notes`,
      ...meetingAttendance.map(
        (a) =>
          `${a.memberName},${a.position},${a.status.toUpperCase()},${a.notes || "N/A"}`
      ),
    ].join("\n");

    const blob = new Blob([exportData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${selectedMeeting.name}-${format(selectedMeeting.date, "yyyy-MM-dd")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Attendance Roll-Calls</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track member attendance across meetings
          </p>
        </div>
        {selectedMeeting && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setViewMode(viewMode === "table" ? "list" : "table")}
            >
              {viewMode === "table" ? <List className="h-4 w-4" /> : <Table className="h-4 w-4" />}
            </Button>
            <Button size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Date Filter */}
      <Card className="p-4">
        <Button variant="outline" className="w-full justify-start">
          <Calendar className="h-4 w-4 mr-2" />
          Filter by Date [Day, Month, Year]
        </Button>
      </Card>

      {selectedMeeting ? (
        /* Attendance Details View */
        <div className="space-y-4">
          {/* Back Button and Meeting Info */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedMeeting.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(selectedMeeting.date, "MMMM dd, yyyy")} •{" "}
                  {selectedMeeting.duration}
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
              {(() => {
                const stats = calculateStats();
                return (
                  <>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">{stats.total}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center p-3 bg-green-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.present}
                      </div>
                      <div className="text-xs text-muted-foreground">Present</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {stats.late}
                      </div>
                      <div className="text-xs text-muted-foreground">Late</div>
                    </div>
                    <div className="text-center p-3 bg-red-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {stats.absent}
                      </div>
                      <div className="text-xs text-muted-foreground">Absent</div>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.excused}
                      </div>
                      <div className="text-xs text-muted-foreground">Excused</div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap mb-4">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "present" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("present")}
              >
                Present
              </Button>
              <Button
                variant={statusFilter === "late" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("late")}
              >
                Late
              </Button>
              <Button
                variant={statusFilter === "absent" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("absent")}
              >
                Absent
              </Button>
              <Button
                variant={statusFilter === "excused" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("excused")}
              >
                Excused
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedMeetingId(null)}
            >
              ← Back to Meetings
            </Button>
          </Card>

          {viewMode === "table" ? (
            /* Table View */
            <Card className="p-3">
              <div className="overflow-x-auto -mx-3">
                <div className="inline-flex gap-1 px-3 pb-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    More scrolling out <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
                <table className="min-w-[600px] border-collapse">
                  <thead>
                    <tr>
                      <th className="bg-pink-200 p-2 text-left min-w-[150px] sticky left-0 z-10 border border-gray-300">
                        <div className="font-bold">Member</div>
                        <div className="text-xs font-normal text-muted-foreground">
                          [{meetingAttendance.length} attendees]
                        </div>
                      </th>
                      <th className="bg-gray-200 p-2 text-center min-w-[120px] border border-gray-300">
                        <div className="font-bold">Status</div>
                      </th>
                      <th className="bg-gray-200 p-2 text-center min-w-[120px] border border-gray-300">
                        <div className="font-bold">Arrival Time</div>
                      </th>
                      <th className="bg-gray-200 p-2 text-center min-w-[200px] border border-gray-300">
                        <div className="font-bold">Notes</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((attendance) => (
                      <tr key={attendance.id}>
                        <td className="bg-pink-200 p-2 sticky left-0 z-10 border border-gray-300">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={attendance.avatar}
                                alt={attendance.memberName}
                              />
                              <AvatarFallback>
                                {attendance.memberName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-sm">
                                {attendance.memberName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {attendance.position}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-1 border border-gray-300">
                          <div className="flex justify-center">
                            <div
                              className={`border-2 ${getStatusColor(
                                attendance.status
                              )} w-20 h-8 flex items-center justify-center font-semibold text-xs`}
                            >
                              {attendance.status.toUpperCase()}
                            </div>
                          </div>
                        </td>
                        <td className="p-2 text-center border border-gray-300">
                          <div className="text-sm">
                            {attendance.arrivalTime
                              ? format(attendance.arrivalTime, "h:mm a")
                              : "---"}
                          </div>
                        </td>
                        <td className="p-2 border border-gray-300">
                          <div className="text-xs text-muted-foreground">
                            {attendance.notes || "---"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filteredAttendance.map((attendance) => (
                <Card key={attendance.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={attendance.avatar}
                        alt={attendance.memberName}
                      />
                      <AvatarFallback>
                        {attendance.memberName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{attendance.memberName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {attendance.position}
                      </p>
                      {attendance.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {attendance.notes}
                        </p>
                      )}
                      {attendance.arrivalTime && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Arrived: {format(attendance.arrivalTime, "h:mm a")}
                        </p>
                      )}
                    </div>

                    {getStatusBadge(attendance.status)}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Meeting List View */
        <div className="space-y-4">
          {displayedMeetings.map((meeting, index) => {
            const meetingAttendanceCount = mockAttendance.filter(
              (a) => a.meetingId === meeting.id
            ).length;

            return (
              <div key={meeting.id}>
                {index === 2 && (
                <div className="mb-4">
                  <PremiumAdRotation 
                    slotId={premiumAdSlots[0].slotId}
                    ads={premiumAdSlots[0].ads}
                  />
                </div>
                )}
                <Card className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {meeting.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {format(meeting.date, "MMMM dd, yyyy")} • {meeting.duration}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {meetingAttendanceCount} attendance records
                      </div>
                    </div>
                    <Button onClick={() => setSelectedMeetingId(meeting.id)}>
                      View Attendance
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
