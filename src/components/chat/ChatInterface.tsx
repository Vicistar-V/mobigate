import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Conversation } from "@/types/chat";
import { formatChatTime } from "@/data/chatData";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";

interface ChatInterfaceProps {
  conversation: Conversation | undefined;
  isTyping: boolean;
  onSendMessage: (content: string) => void;
}

export const ChatInterface = ({
  conversation,
  isTyping,
  onSendMessage,
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
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-card flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.user.avatar} />
            <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
          </Avatar>
          {conversation.user.isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>
        <div>
          <h3 className="font-semibold">{conversation.user.name}</h3>
          <p className="text-xs text-muted-foreground">
            {conversation.user.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {conversation.messages.map((message) => {
            const isCurrentUser = message.senderId === "current-user";
            
            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  isCurrentUser ? "flex-row-reverse" : "flex-row"
                )}
              >
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={conversation.user.avatar} />
                    <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[70%] space-y-1",
                    isCurrentUser && "flex flex-col items-end"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 break-words",
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground px-2">
                    {formatChatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={conversation.user.avatar} />
                <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <ChatInput onSendMessage={onSendMessage} disabled={isTyping} />
    </div>
  );
};
