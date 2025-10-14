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
import { QuizGamePanel } from "./chat/QuizGamePanel";

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
  const isGameMode = !!activeQuizSession && !activeQuizSession.completedAt;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="iconLg" className="hover:bg-primary/10">
          <MessageSquare />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[80vw] p-0 overflow-hidden flex flex-col" showClose={false}>
        {/* Quiz Game Panel - Above Everything */}
        {isGameMode && activeQuizSession && (
          <div className="h-[40vh] sm:h-[45vh] border-b-2 border-border shrink-0">
            <QuizGamePanel
              questions={activeQuizSession.questions}
              currentQuestionIndex={activeQuizSession.currentQuestionIndex}
              score={activeQuizSession.score}
              onAnswer={answerQuizQuestion}
              onExit={exitQuizGame}
              timeRemaining={quizTimeRemaining}
            />
          </div>
        )}

        {/* Chat Area - Below Quiz */}
        <div className="flex flex-1 min-h-0">
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
              onStartQuiz={startQuizGame}
              onExitQuiz={exitQuizGame}
              isGameMode={isGameMode}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
