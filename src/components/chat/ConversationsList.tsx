import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Conversation } from "@/types/chat";
import { formatMessageTime } from "@/data/chatData";
import { cn } from "@/lib/utils";
import { ArrowLeft, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import mobichatLogo from "@/assets/mobichat-logo.svg";

interface ConversationsListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onBack?: () => void;
}

export const ConversationsList = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onBack,
}: ConversationsListProps) => {
  return (
    <div className="flex flex-col h-full border-r border-border">
      <div className="p-4 border-b-[6px] border-[hsl(252,73%,26%)] flex items-center justify-between gap-2 bg-[#f0e699]">
        {onBack ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="h-8 w-8 shrink-0" />
        )}
        
        <div className="flex-1 flex justify-start">
          <img 
            src={mobichatLogo} 
            alt="MobiChat" 
            className="h-8 w-auto"
          />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => toast({ title: "Coming soon" })}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left",
                "hover:bg-accent",
                activeConversationId === conversation.id && "bg-accent"
              )}
            >
              <Link 
                to={`/profile/${conversation.user.id}`}
                onClick={(e) => e.stopPropagation()}
                className="relative shrink-0"
              >
                <Avatar className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage src={conversation.user.avatar} />
                  <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                </Avatar>
                {conversation.user.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Link 
                    to={`/profile/${conversation.user.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-base font-semibold truncate hover:text-primary transition-colors"
                  >
                    {conversation.user.name}
                  </Link>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 px-1.5 text-base">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-base text-muted-foreground line-clamp-1">
                  {conversation.lastMessage}
                </p>
                <p className="text-base text-muted-foreground mt-1">
                  {formatMessageTime(conversation.lastMessageTime)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
