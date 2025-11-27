import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Download, Search, MessageCircle } from "lucide-react";
import { mockMeetings } from "@/data/meetingsData";
import { format } from "date-fns";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MeetingChatsTab = () => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get completed meetings with chat messages
  const meetingsWithChats = mockMeetings.filter(
    (m) => m.status === "completed" && m.chatMessages.length > 0
  );

  const totalPages = Math.ceil(meetingsWithChats.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedMeetings = meetingsWithChats.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const selectedMeeting = mockMeetings.find((m) => m.id === selectedMeetingId);

  const premiumAdSlots = [
    {
      slotId: "chats-ad-1",
      ads: [
        {
          id: "chats-ad-1",
          advertiser: {
            name: "Communication Tools Pro",
            verified: true,
          },
          content: {
            headline: "Better Meeting Communication",
            description: "Professional chat and collaboration tools for your meetings.",
            ctaText: "Try Free",
            ctaUrl: "https://example.com",
          },
          media: {
            type: "image" as const,
            items: [
              {
                url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
              },
            ],
          },
          layout: "standard" as const,
          duration: 15,
        },
      ],
    },
  ];

  const handleDownloadChat = (meetingId: string) => {
    const meeting = mockMeetings.find((m) => m.id === meetingId);
    if (!meeting) return;

    // Create chat transcript
    const transcript = meeting.chatMessages
      .map(
        (msg) =>
          `[${format(msg.timestamp, "HH:mm:ss")}] ${msg.senderName}: ${msg.content}`
      )
      .join("\n");

    // Create downloadable file
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meeting-chat-${meeting.name}-${format(meeting.date, "yyyy-MM-dd")}.txt`;
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
          <h2 className="text-2xl font-bold">Meeting Chats</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View and download meeting chat history
          </p>
        </div>
      </div>

      {/* Date Filter and Search */}
      <Card className="p-4">
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Filter by Date [Day, Month, Year]
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      {selectedMeeting ? (
        /* Chat Viewer */
        <div className="space-y-4">
          {/* Back Button and Meeting Info */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold">{selectedMeeting.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(selectedMeeting.date, "MMMM dd, yyyy")} •{" "}
                  {selectedMeeting.duration || "N/A"}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => handleDownloadChat(selectedMeeting.id)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
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

          {/* Chat Messages */}
          <Card className="p-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {selectedMeeting.chatMessages
                  .filter((msg) =>
                    searchQuery
                      ? msg.content
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        msg.senderName
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      : true
                  )
                  .map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src={message.senderAvatar}
                          alt={message.senderName}
                        />
                        <AvatarFallback>
                          {message.senderName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {message.senderName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(message.timestamp, "h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      ) : (
        /* Meeting List */
        <div className="space-y-4">
          {displayedMeetings.map((meeting, index) => (
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
                      {format(meeting.date, "MMMM dd, yyyy")} •{" "}
                      {meeting.duration}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      {meeting.chatMessages.length} messages
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMeetingId(meeting.id)}
                    >
                      View Chat
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownloadChat(meeting.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}

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
