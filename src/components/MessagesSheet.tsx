import { useState, useEffect } from "react";
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
  
  // Calculate total unread messages
  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  // Listen for custom event to open chat with specific user
  useEffect(() => {
    const handleOpenChat = (event: CustomEvent) => {
      const { conversationId, userId, userName } = event.detail;
      
      // Try to find conversation by conversationId, userId, or userName (in that order)
      let conversation = conversations.find(conv => conv.id === conversationId);
      
      if (!conversation && userId) {
        conversation = conversations.find(conv => conv.user.id === userId);
      }
      
      if (!conversation && userName) {
        conversation = conversations.find(
          conv => conv.user.name.toLowerCase().includes(userName.toLowerCase())
        );
      }
      
      // Fallback: if still no match, use the first conversation to show chat interface
      if (!conversation && conversations.length > 0) {
        conversation = conversations[0];
      }
      
      if (conversation) {
        // First select the conversation, then open the sheet
        selectConversation(conversation.id);
        setIsOpen(true);
      } else {
        // No conversations at all, just open the sheet
        setIsOpen(true);
      }
    };

    window.addEventListener('openChatWithUser' as any, handleOpenChat);
    return () => {
      window.removeEventListener('openChatWithUser' as any, handleOpenChat);
    };
  }, [conversations, selectConversation]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="iconLg" className="relative hover:bg-primary/10" data-messages-trigger>
          <MessageSquare />
          {totalUnreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
            </span>
          )}
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
