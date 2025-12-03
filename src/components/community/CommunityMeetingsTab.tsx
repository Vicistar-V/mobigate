import { useState } from "react";
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
  mockMeetings,
  mockUpcomingMeetings,
  mockParticipants,
  mockChatMessages,
  MeetingParticipant,
  MeetingChatMessage,
  Meeting,
} from "@/data/meetingsData";

type MeetingView = "lobby" | "live" | "history";
type MeetingType = "executive" | "general";

export const CommunityMeetingsTab = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [meetingView, setMeetingView] = useState<MeetingView>("lobby");
  const [selectedMeetingType, setSelectedMeetingType] = useState<MeetingType>("general");
  const [isMeetingActive, setIsMeetingActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedParticipantId, setExpandedParticipantId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<MeetingChatMessage[]>(mockChatMessages);
  const [participants] = useState<MeetingParticipant[]>(mockParticipants);

  const handleJoinMeeting = () => {
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

  const handleSendMessage = (message: string) => {
    const newMessage: MeetingChatMessage = {
      id: `m${chatMessages.length + 1}`,
      senderId: "you",
      senderName: "You",
      senderAvatar: "/placeholder.svg",
      content: message,
      timestamp: new Date(),
    };
    setChatMessages([...chatMessages, newMessage]);
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
          
          {/* Meeting Type Toggles */}
          <div className="grid grid-cols-2 gap-4">
            {/* Executive Meetings */}
            <div className="space-y-2">
              <Button
                variant={selectedMeetingType === "executive" ? "default" : "outline"}
                className="w-full justify-between"
                onClick={() => setSelectedMeetingType("executive")}
              >
                <span>Executive Meetings</span>
                <MoreVertical className="w-4 h-4" />
              </Button>
              <div className="flex gap-2">
                <Badge variant="default" className="bg-green-600">
                  <span className="w-2 h-2 bg-white rounded-full mr-1" />
                  Online
                </Badge>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* General Meetings */}
            <div className="space-y-2">
              <Button
                variant={selectedMeetingType === "general" ? "default" : "outline"}
                className="w-full justify-between"
                onClick={() => setSelectedMeetingType("general")}
              >
                <span>General Meetings</span>
                <MoreVertical className="w-4 h-4" />
              </Button>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-muted">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full mr-1" />
                  Offline
                </Badge>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lobby View */}
      {meetingView === "lobby" && (
        <div className="space-y-4">
          {/* Join Meeting Button */}
          <Button
            onClick={handleJoinMeeting}
            size="lg"
            className="w-full gap-2 h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Video className="w-6 h-6" />
            Join {selectedMeetingType === "executive" ? "Executive" : "General"} Meeting Now
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
                  <DrawerContent className="h-[80vh] overflow-hidden">
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
