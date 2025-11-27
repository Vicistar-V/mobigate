import { Meeting } from "@/data/meetingsData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Download, Calendar } from "lucide-react";
import { format } from "date-fns";

interface PreviousMeetingsListProps {
  meetings: Meeting[];
  onSelectMeeting: (meeting: Meeting) => void;
}

export const PreviousMeetingsList = ({
  meetings,
  onSelectMeeting,
}: PreviousMeetingsListProps) => {
  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="text-lg font-semibold">Previous Meetings</h3>
        <Button variant="ghost" size="sm" className="gap-2">
          <Calendar className="w-4 h-4" />
          Dates
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="w-full justify-start px-4">
          <TabsTrigger value="messages">Chat Messages</TabsTrigger>
          <TabsTrigger value="download">Download Meeting Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="px-4 mt-4">
          <div className="space-y-3">
            {meetings.filter(m => m.status === "completed").map((meeting) => (
              <Card
                key={meeting.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelectMeeting(meeting)}
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
                      {meeting.duration && (
                        <p className="text-xs text-muted-foreground">
                          Duration: {meeting.duration}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button variant="outline" size="icon">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Page 1 of 3</span>
            <Button variant="outline" size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="download" className="px-4 mt-4">
          <div className="space-y-3">
            {meetings.filter(m => m.status === "completed").map((meeting) => (
              <Card key={meeting.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-semibold">{meeting.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(meeting.date, "MMMM d, yyyy")}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
