import { Meeting, mockUpcomingEvents, mockInvitations } from "@/data/meetingsData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format } from "date-fns";

interface UpcomingSchedulesListProps {
  meetings: Meeting[];
  onSelectSchedule: (item: any) => void;
}

export const UpcomingSchedulesList = ({
  meetings,
  onSelectSchedule,
}: UpcomingSchedulesListProps) => {
  const upcomingMeetings = meetings.filter(m => m.status === "upcoming");

  return (
    <div className="py-4 border-t border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="text-lg font-semibold">Upcoming Schedules</h3>
        <Button variant="ghost" size="sm" className="gap-2">
          <Calendar className="w-4 h-4" />
          Dates
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="meetings" className="w-full">
        <TabsList className="w-full justify-start px-4">
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="px-4 mt-4">
          <div className="space-y-3">
            {upcomingMeetings.map((meeting) => (
              <Card
                key={meeting.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelectSchedule(meeting)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{meeting.name}</h4>
                        <Badge
                          variant={meeting.type === "general" ? "default" : "secondary"}
                          className={
                            meeting.type === "general"
                              ? "bg-green-600"
                              : "bg-yellow-600"
                          }
                        >
                          {meeting.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(meeting.date, "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="px-4 mt-4">
          <div className="space-y-3">
            {mockUpcomingEvents.map((event) => (
              <Card
                key={event.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelectSchedule(event)}
              >
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{event.name}</h4>
                      <Badge variant="outline">Event</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(event.date, "MMMM d, yyyy")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invitations" className="px-4 mt-4">
          <div className="space-y-3">
            {mockInvitations.map((invitation) => (
              <Card
                key={invitation.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelectSchedule(invitation)}
              >
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{invitation.name}</h4>
                      <Badge variant="secondary">Invitation</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      From: {invitation.from}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(invitation.date, "MMMM d, yyyy")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button variant="outline" size="icon">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground">Page 1 of 2</span>
        <Button variant="outline" size="icon">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
