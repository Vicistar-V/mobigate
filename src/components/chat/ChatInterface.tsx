import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation } from "@/types/chat";
import { formatChatTime } from "@/data/chatData";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import { Video, Phone, MoreVertical, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInterfaceProps {
  conversation: Conversation | undefined;
  isTyping: boolean;
  onSendMessage: (content: string) => void;
  onBack?: () => void;
}

export const ChatInterface = ({
  conversation,
  isTyping,
  onSendMessage,
  onBack,
}: ChatInterfaceProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages, isTyping]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-muted-foreground">
            Select a conversation
          </p>
          <p className="text-sm text-muted-foreground">
            Choose a contact to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="px-4 py-[10px] border-b flex items-center bg-[#f9f9f9] border-[#e9edef] flex-shrink-0">
        {onBack && (
          <Button variant="ghost" className="h-auto w-auto p-2 rounded-full text-[#54656f] hover:bg-[#e9e9e9] mr-2 sm:hidden" onClick={onBack}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}
        <div className="relative mr-[15px]">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.user.avatar} />
            <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
          </Avatar>
          {conversation.user.isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-[#00a884] border-2 border-white rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#111b21] text-base">{conversation.user.name}</h3>
          <p className="text-[13px] text-[#667781]">
            {conversation.user.isOnline ? "online" : "Offline"}
          </p>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" className="h-auto w-auto p-2 rounded-full text-[#54656f] hover:bg-[#e9e9e9] ml-2">
            <Video className="h-6 w-6" />
          </Button>
          <Button variant="ghost" className="h-auto w-auto p-2 rounded-full text-[#54656f] hover:bg-[#e9e9e9] ml-2">
            <Phone className="h-6 w-6" />
          </Button>
          <Button variant="ghost" className="h-auto w-auto p-2 rounded-full text-[#54656f] hover:bg-[#e9e9e9] ml-2">
            <MoreVertical className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 p-5 overflow-y-auto flex flex-col bg-[#E5DDD5]"
        style={{
          backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAA1BMVEXm5+i+5p7XAAAAR0lEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADeDcYqAAE0I2HfAAAAAElFTkSuQmCC")'
        }}
        ref={scrollRef}
      >
        {conversation.messages.map((message) => {
            const isCurrentUser = message.senderId === "current-user";
            
            return (
              <div
                key={message.id}
                className={cn(
                  "flex mb-4 max-w-[70%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                  isCurrentUser ? "self-end" : "self-start"
                )}
              >
                <div
                  className={cn(
                    "px-3 py-2 rounded-lg shadow-sm relative",
                    isCurrentUser
                      ? "bg-[#d9fdd3] rounded-br-none"
                      : "bg-white rounded-bl-none"
                  )}
                >
                  <p className="text-sm text-[#111b21] break-words mb-1">{message.content}</p>
                  <span className="text-[11px] text-[#667781] float-right ml-2 mt-1">
                    {formatChatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex self-start mb-4">
              <div className="bg-white rounded-lg rounded-bl-none shadow-sm px-3 py-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-[#9E9E9E] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[#9E9E9E] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[#9E9E9E] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={onSendMessage} disabled={isTyping} />
    </div>
  );
};
