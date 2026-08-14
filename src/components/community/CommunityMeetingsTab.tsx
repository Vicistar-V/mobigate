import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical, Video, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MeetingVideoGrid } from "./meetings/MeetingVideoGrid";
import { MeetingEmojiBar } from "./meetings/MeetingEmojiBar";
import { MeetingControlBar } from "./meetings/MeetingControlBar";
import { MeetingParticipantsList } from "./meetings/MeetingParticipantsList";
import { MeetingChatPanel } from "./meetings/MeetingChatPanel";
import { PreviousMeetingsList } from "./meetings/PreviousMeetingsList";
import { UpcomingSchedulesList } from "./meetings/UpcomingSchedulesList";
import { PremiumAdCard } from "@/components/PremiumAdCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  MeetingParticipant,
  MeetingChatMessage,
  Meeting,
} from "@/data/meetingsData";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type MeetingView = "lobby" | "live" | "history";
type MeetingType = "executive" | "general";

export const CommunityMeetingsTab = ({ communityId }: { communityId?: string } = {}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [meetingView, setMeetingView] = useState<MeetingView>("lobby");
  const [selectedMeetingType, setSelectedMeetingType] = useState<MeetingType>("general");
  const [isMeetingActive, setIsMeetingActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedParticipantId, setExpandedParticipantId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<MeetingChatMessage[]>([]);
  const [participants] = useState<MeetingParticipant[]>([]);

  const [mockMeetings, setMockMeetings] = useState<Meeting[]>([]);
  const [mockUpcomingMeetings, setMockUpcomingMeetings] = useState<Meeting[]>([]);
  const [canStartNewMeeting, setCanStartNewMeeting] = useState(true);
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);

  const loadMeetings = useCallback(() => {
    if (!communityId) return;
    fetch(`/api/community/meetings_admin.php?community_id=${communityId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const mapMeeting = (m: any): Meeting => ({
          id: m.id, type: m.type === "executive" ? "executive" : "general", name: m.title,
          date: new Date(m.meeting_date), status: m.status === "in-progress" ? "live" : m.status === "completed" ? "completed" : "upcoming",
          participants: [], chatMessages: [],
        });
        setMockUpcomingMeetings((d.upcoming ?? []).map(mapMeeting));
        setMockMeetings((d.past ?? []).map(mapMeeting));
      })
      .catch(() => {});

    fetch(`/api/community/meetings_admin.php?action=minutes&community_id=${communityId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const pending = (d.minutes ?? []).find((m: any) => m.status === "pending_adoption");
        setCanStartNewMeeting(!pending);
      })
      .catch(() => {});
  }, [communityId]);

  useEffect(() => { loadMeetings(); }, [loadMeetings]);

  const loadChat = useCallback((meetingId: string) => {
    if (!communityId) return;
    fetch(`/api/community/meetings_admin.php?action=chats&meeting_id=${meetingId}&community_id=${communityId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setChatMessages((d.messages ?? []).map((m: any) => ({
          id: m.id, senderId: m.sender_id, senderName: m.sender_name?.trim() || "Member",
          senderAvatar: m.sender_avatar || "/placeholder.svg", content: m.content, timestamp: new Date(m.created_at),
        })));
      })
      .catch(() => {});
  }, [communityId]);

  const handleJoinMeeting = async () => {
    if (!canStartNewMeeting) {
      toast({
        title: "Meeting Locked",
        description: "Previous meeting minutes must be adopted before joining new meetings.",
        variant: "destructive",
      });
      return;
    }
    const meetingId = mockUpcomingMeetings[0]?.id;
    if (meetingId && communityId) {
      try {
        await fetch("/api/community/meetings_admin.php", {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "mark_attendance", community_id: communityId, meeting_id: meetingId, status: "present" }),
        });
        setActiveMeetingId(meetingId);
        loadChat(meetingId);
      } catch { /* attendance marking is best-effort */ }
    }
    setMeetingView("live");
    setIsMeetingActive(true);
    toast({
      title: "Joined Meeting",
      description: `You've joined the ${selectedMeetingType} meeting`,
    });
  };

  const handleDisconnect = () => {
    setMeetingView("lobby");
    setIsMeetingActive(false);
    setIsPaused(false);
    setIsChatOpen(false);
    setExpandedParticipantId(null);
    toast({
      title: "Disconnected",
      description: "You've left the meeting",
    });
  };

  const handlePause = () => {
    setIsPaused(true);
    toast({
      title: "Video Paused",
      description: "Your video has been paused",
    });
  };

  const handleResume = () => {
    setIsPaused(false);
    toast({
      title: "Video Resumed",
      description: "Your video is now active",
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    toast({
      title: "Emoji Reaction",
      description: `You reacted with ${emoji}`,
    });
  };

  const handleSendMessage = async (message: string) => {
    const optimisticMessage: MeetingChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: "you",
      senderName: "You",
      senderAvatar: "/placeholder.svg",
      content: message,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, optimisticMessage]);

    if (activeMeetingId && communityId) {
      try {
        await fetch("/api/community/meetings_admin.php", {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "post_chat_message", community_id: communityId, meeting_id: activeMeetingId, content: message }),
        });
        loadChat(activeMeetingId);
      } catch { /* the optimistic message still shows even if the sync fails */ }
    }
  };

  const handleDownloadChat = () => {
    toast({
      title: "Downloading Chat",
      description: "Meeting chat will be downloaded",
    });
  };

  const handleSelectParticipant = (participant: MeetingParticipant) => {
    toast({
      title: "Participant Selected",
      description: `Viewing ${participant.name}`,
    });
  };

  const handleSelectMeeting = (meeting: Meeting) => {
    toast({
      title: "Meeting Selected",
      description: meeting.name,
    });
  };

  const handleSelectSchedule = (item: any) => {
    toast({
      title: "Schedule Selected",
      description: item.name,
    });
  };

  const ChatPanelContent = () => (
    <div className="h-full overflow-hidden">
      <MeetingChatPanel
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        onDownloadChat={handleDownloadChat}
      />
    </div>
  );

  return (
    <div className="w-full">
      {/* Header Section */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">Community Meetings & Activities</h2>
          
          {/* Meeting Type Selection Row */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Button
              variant={selectedMeetingType === "executive" ? "default" : "outline"}
              size="sm"
              className="rounded-full px-4"
              onClick={() => setSelectedMeetingType("executive")}
            >
              Executive Meeting
            </Button>
            <Button
              variant={selectedMeetingType === "general" ? "default" : "outline"}
              size="sm"
              className="rounded-full px-4"
              onClick={() => setSelectedMeetingType("general")}
            >
              General Meeting
            </Button>
          </div>

          {/* Status Indicators Row */}
          <div className="flex items-center gap-3">
            {/* Executive Status */}
            <div className="flex items-center gap-1.5">
              <Badge variant="default" className="bg-green-600 text-xs px-2 py-0.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse" />
                Online
              </Badge>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </div>
            
            {/* General Status */}
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className="bg-muted text-xs px-2 py-0.5">
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mr-1" />
                Offline
              </Badge>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lobby View */}
      {meetingView === "lobby" && (
        <div className="space-y-4">
          {/* Meeting Lock Alert */}
          {!canStartNewMeeting && pendingMinutes && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                <strong>New Meetings Locked:</strong> The minutes from "{pendingMinutes.meetingName}" 
                must be adopted before new meetings can proceed.{" "}
                <span className="font-medium">
                  ({pendingMinutes.adoptionPercentage}% of {pendingMinutes.adoptionThreshold}% required)
                </span>
              </AlertDescription>
            </Alert>
          )}

          {/* Join Meeting Button */}
          <Button
            onClick={handleJoinMeeting}
            size="lg"
            disabled={!canStartNewMeeting}
            className={`w-full gap-2 h-auto min-h-14 py-3 text-sm sm:text-lg whitespace-normal text-center ${
              canStartNewMeeting
                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Video className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="leading-tight">
              {canStartNewMeeting 
                ? `Join ${selectedMeetingType === "executive" ? "Executive" : "General"} Meeting Now`
                : "Meeting Locked - Adopt Previous Minutes"
              }
            </span>
          </Button>

          {/* Premium Ad */}
          <PremiumAdCard
            id="meeting-ad-1"
            advertiser={{
              name: "TechVision Solutions",
              logo: "/placeholder.svg"
            }}
            content={{
              headline: "Transform Your Business",
              description: "Leading technology solutions for modern enterprises",
              ctaText: "Learn More"
            }}
            media={{
              type: "image",
              items: [{ url: "/placeholder.svg" }]
            }}
            layout="compact"
          />

          {/* Previous Meetings */}
          <PreviousMeetingsList
            meetings={mockMeetings}
            onSelectMeeting={handleSelectMeeting}
          />

          {/* Premium Ad */}
          <PremiumAdCard
            id="meeting-ad-2"
            advertiser={{
              name: "Global Consultants",
              logo: "/placeholder.svg"
            }}
            content={{
              headline: "Expert Advice for Growth",
              description: "Professional consulting services for your business success",
              ctaText: "Contact Us"
            }}
            media={{
              type: "image",
              items: [{ url: "/placeholder.svg" }]
            }}
            layout="compact"
          />

          {/* Upcoming Schedules */}
          <UpcomingSchedulesList
            meetings={mockUpcomingMeetings}
            onSelectSchedule={handleSelectSchedule}
          />
        </div>
      )}

      {/* Live Meeting View */}
      {meetingView === "live" && (
        <div className="space-y-0">
          {/* Video Grid */}
          <MeetingVideoGrid
            participants={participants}
            expandedParticipantId={expandedParticipantId}
            onExpandParticipant={setExpandedParticipantId}
          />

          {/* Only show controls when not expanded */}
          {!expandedParticipantId && (
            <>
              {/* Emoji Bar */}
              <MeetingEmojiBar onEmojiSelect={handleEmojiSelect} />

              {/* Control Bar */}
              <MeetingControlBar
                isActive={isMeetingActive}
                isPaused={isPaused}
                isChatOpen={isChatOpen}
                onPause={handlePause}
                onResume={handleResume}
                onDisconnect={handleDisconnect}
                onToggleChat={() => setIsChatOpen(!isChatOpen)}
              />

              {/* Participants List */}
              <MeetingParticipantsList
                participants={participants}
                onSelectParticipant={handleSelectParticipant}
              />

              {/* Chat Panel - Drawer on mobile, Dialog on desktop */}
              {isMobile ? (
                <Drawer open={isChatOpen} onOpenChange={setIsChatOpen}>
                  <DrawerContent className="h-[80vh] overflow-hidden touch-auto">
                    <ChatPanelContent />
                  </DrawerContent>
                </Drawer>
              ) : (
                <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                  <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden p-0">
                    <ChatPanelContent />
                  </DialogContent>
                </Dialog>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
