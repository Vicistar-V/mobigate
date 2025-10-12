import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MessageSquare, ArrowLeft } from "lucide-react";
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

  const showMobileChat = activeConversationId !== null;

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
          <div className={`${showMobileChat ? 'hidden sm:block sm:w-80 lg:w-96' : 'w-full'} shrink-0 transition-all`}>
            <ConversationsList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={selectConversation}
            />
          </div>

          {/* Chat Interface - Right Panel */}
          <div className={`flex-1 ${showMobileChat ? 'flex' : 'hidden'}`}>
            {showMobileChat && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-4 z-10 sm:hidden"
                onClick={() => selectConversation(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
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
