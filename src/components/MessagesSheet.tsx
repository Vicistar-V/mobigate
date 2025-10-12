import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MessageSquare } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { ConversationsList } from "./chat/ConversationsList";
import { ChatInterface } from "./chat/ChatInterface";

export const MessagesSheet = () => {
  const {
    conversations,
    activeConversation,
    activeConversationId,
    isTyping,
    sendMessage,
    selectConversation,
  } = useChat();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="iconLg" className="hover:bg-primary/10">
          <MessageSquare />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[80vw] p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Conversations List - Left Panel */}
          <div className="w-full sm:w-80 lg:w-96 shrink-0">
            <ConversationsList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={selectConversation}
            />
          </div>

          {/* Chat Interface - Right Panel */}
          <div className="hidden sm:flex flex-1">
            <ChatInterface
              conversation={activeConversation}
              isTyping={isTyping}
              onSendMessage={sendMessage}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
