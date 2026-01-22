import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download } from "lucide-react";
import { ElectionChatMessage } from "@/data/electionData";
import { formatDistanceToNow } from "date-fns";

interface ElectionChatSectionProps {
  messages: ElectionChatMessage[];
  onDownload?: () => void;
}

export const ElectionChatSection = ({ messages, onDownload }: ElectionChatSectionProps) => {
  return (
    <Card className="p-4 mb-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Chat Messages</h3>
          <Button variant="outline" size="sm" className="w-fit" onClick={onDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download Meeting Chat
          </Button>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3 p-3 bg-muted rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarImage src={message.avatar} alt={message.senderName} />
                <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{message.senderName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No chat messages yet. Be the first to start the conversation!
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
