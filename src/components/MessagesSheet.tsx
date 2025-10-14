import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const {
    conversations,
    activeConversation,
    activeConversationId,
    isTyping,
    selectedMessages,
    activeQuizSession,
    quizTimeRemaining,
    sendMessage,
    selectConversation,
    editMessage,
    deleteMessage,
    deleteSelectedMessages,
    reactToMessage,
    toggleSelectMessage,
    clearSelection,
    startQuizGame,
    answerQuizQuestion,
    exitQuizGame,
  } = useChat();

  const showMobileChat = activeConversationId !== null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="iconLg" className="hover:bg-primary/10">
          <MessageSquare />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[80vw] p-0 overflow-hidden" showClose={false}>
        <div className="flex h-full">
          {/* Conversations List - Left Panel */}
          <div className={`${showMobileChat ? 'hidden sm:block sm:w-80 lg:w-96' : 'w-full'} shrink-0 transition-all`}>
            <ConversationsList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={selectConversation}
              onBack={() => setIsOpen(false)}
            />
          </div>

          {/* Chat Interface - Right Panel */}
          <div className={`flex-1 min-w-0 ${showMobileChat ? 'flex' : 'hidden'}`}>
            <ChatInterface
              conversation={activeConversation}
              isTyping={isTyping}
              onSendMessage={sendMessage}
              onEditMessage={editMessage}
              onDeleteMessage={deleteMessage}
              onReactToMessage={reactToMessage}
              selectedMessages={selectedMessages}
              onToggleSelectMessage={toggleSelectMessage}
              onClearSelection={clearSelection}
              onDeleteSelectedMessages={deleteSelectedMessages}
              onBack={() => selectConversation(null)}
              onCloseSheet={() => setIsOpen(false)}
              quizSession={activeQuizSession}
              quizTimeRemaining={quizTimeRemaining}
              onStartQuiz={startQuizGame}
              onAnswerQuiz={answerQuizQuestion}
              onExitQuiz={exitQuizGame}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
