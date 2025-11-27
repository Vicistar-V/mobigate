import { MeetingChatMessage } from "@/data/meetingsData";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Send } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface MeetingChatPanelProps {
  messages: MeetingChatMessage[];
  onSendMessage: (message: string) => void;
  onDownloadChat: () => void;
}

export const MeetingChatPanel = ({
  messages,
  onSendMessage,
  onDownloadChat,
}: MeetingChatPanelProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-t border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold">Chat Messages</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDownloadChat}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                <AvatarFallback>{message.senderName[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-sm font-medium">{message.senderName}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(message.timestamp, "HH:mm")}
                  </p>
                </div>
                <p className="text-sm text-foreground">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
