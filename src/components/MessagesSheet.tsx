/**
 * MessagesSheet.tsx — Updated with API-powered conversations
 * No mock data. Shows loading spinner and empty state.
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare, Loader2 } from "lucide-react";
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
    loadingConversations,
    sendMessage,
    selectConversation,
    openConversationWithUser,
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
  const isGameMode     = !!activeQuizSession && !activeQuizSession.completedAt;

  // Total unread badge count
  const totalUnread = conversations.reduce((t, c) => t + c.unreadCount, 0);

  // Listen for openChatWithUser events (from ChatWithFriendsDialog)
  useEffect(() => {
    const handleOpenChat = (event: CustomEvent) => {
      const { conversationId, userId, userName } = event.detail;

      let conv = conversations.find(c => c.id === conversationId);
      if (!conv && userId)   conv = conversations.find(c => c.user.id === userId);
      if (!conv && userName) conv = conversations.find(c =>
        c.user.name.toLowerCase().includes(userName.toLowerCase())
      );
      if (!conv && conversations.length > 0) conv = conversations[0];

      if (conv) selectConversation(conv.id);
      setIsOpen(true);
    };

    window.addEventListener("openChatWithUser" as any, handleOpenChat);
    return () => window.removeEventListener("openChatWithUser" as any, handleOpenChat);
  }, [conversations, selectConversation]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="iconLg"
          className="relative hover:bg-primary/10"
          data-messages-trigger
        >
          <MessageSquare />
          {totalUnread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-sm font-bold text-destructive-foreground">
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        className="w-full sm:max-w-[95vw] lg:max-w-[80vw] p-0 overflow-hidden flex flex-col"
        showClose={false}
      >
        {/* Quiz panel */}
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

        {/* Chat area */}
        <div className="flex flex-1 min-h-0">

          {/* Conversations list */}
          <div
            className={`${
              showMobileChat ? "hidden sm:block sm:w-80 lg:w-96" : "w-full"
            } shrink-0 transition-all`}
          >
            {loadingConversations ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Loading conversations…</span>
              </div>
            ) : (
              <ConversationsList
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={selectConversation}
                onBack={() => setIsOpen(false)}
                onCloseSheet={() => setIsOpen(false)}
              />
            )}
          </div>

          {/* Chat interface */}
          <div className={`flex-1 min-w-0 ${showMobileChat ? "flex" : "hidden"}`}>
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
