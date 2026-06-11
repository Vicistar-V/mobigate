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
    totalUnread,
    loadingConvs,
    loadingMsgs,
    sendMessage,
    selectConversation,
    startConversationWith,
    fetchConversations,
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
  const totalUnreadCount = totalUnread ?? conversations.reduce((t, c) => t + c.unreadCount, 0);

  // Refresh conversations whenever the sheet opens
  useEffect(() => {
    if (isOpen) fetchConversations(true);
  }, [isOpen, fetchConversations]);
  // Listen for custom event to open chat with specific user
  useEffect(() => {
    const handleOpenChat = async (event: CustomEvent) => {
      const { conversationId, userId, userName, userAvatar } = event.detail;

      // If we have a direct conversationId, select it then open
      if (conversationId) {
        selectConversation(conversationId);
        setIsOpen(true);
        return;
      }

      // If userId provided — create/find conversation first, THEN open sheet
      if (userId) {
        setIsOpen(true); // open immediately so user sees loading
        const convId = await startConversationWith(userId, userName, userAvatar);
        if (!convId) {
          // Still open but no conversation found — user sees empty list
          console.warn('[MessagesSheet] Could not start conversation with', userId);
        }
        return;
      }


      // Fallback: search by name in existing conversations
      if (userName) {
        const conv = conversations.find(c =>
          c.user.name.toLowerCase().includes(userName.toLowerCase())
        );
        if (conv) {
          selectConversation(conv.id);
        } else {
          // No match — just open the sheet
        }
        setIsOpen(true);
      }
    };

    const handleCloseChat = () => setIsOpen(false);

    window.addEventListener('openChatWithUser' as any, handleOpenChat);
    window.addEventListener('closeChatSheet' as any, handleCloseChat);
    return () => {
      window.removeEventListener('openChatWithUser' as any, handleOpenChat);
      window.removeEventListener('closeChatSheet' as any, handleCloseChat);
    };
  }, [conversations, selectConversation, startConversationWith]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="iconLg" className="relative hover:bg-primary/10" data-messages-trigger>
          <MessageSquare />
          {totalUnreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-sm font-bold text-destructive-foreground">
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
              onCloseSheet={() => setIsOpen(false)}
              loading={loadingConvs}
            />
          </div>

          {/* Chat Interface - Right Panel */}
          <div className={`flex-1 min-w-0 ${showMobileChat ? 'flex' : 'hidden'} relative`}>
            {/* Loading overlay while messages load or conversation is being created */}
            {loadingMsgs && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 gap-3">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground font-medium">Loading messages...</p>
              </div>
            )}
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
