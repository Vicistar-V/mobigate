/**
 * useChat.ts — API-powered chat hook
 * Fetches real conversations from /api/chat/conversations.php
 * Falls back to empty array (no mock data) when API is unavailable.
 */

import { useState, useCallback, useEffect } from "react";
import { Message, Conversation, QuizSession } from "@/types/chat";
import { getRandomQuestions } from "@/data/quizData";
import { useAuth } from "@/contexts/useAuth";

const API_BASE =
  (import.meta.env.VITE_API_URL as string) ||
  "https://angola-press.com/en/api";

// ─── API types ────────────────────────────────────────────────────────────────
interface ApiConversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
    is_online: boolean;
  };
  last_message: string;
  last_message_time: string;
  unread_count: number;
  messages: ApiMessage[];
}

interface ApiMessage {
  id: string;
  sender_id: string;
  content: string;
  timestamp: string;
  is_read: boolean;
  is_edited?: boolean;
  attachments?: Message["attachments"];
  reactions?: Message["reactions"];
  reply_to?: Message["replyTo"];
}

// Map API message to local Message type
const mapMessage = (m: ApiMessage): Message => ({
  id:          m.id,
  senderId:    m.sender_id,
  content:     m.content,
  timestamp:   new Date(m.timestamp),
  isRead:      m.is_read,
  isEdited:    m.is_edited,
  attachments: m.attachments,
  reactions:   m.reactions,
  replyTo:     m.reply_to,
});

// Map API conversation to local Conversation type
const mapConversation = (c: ApiConversation): Conversation => ({
  id:              c.id,
  user: {
    id:       c.user.id,
    name:     c.user.name,
    avatar:   c.user.avatar || "",
    isOnline: c.user.is_online,
  },
  messages:        (c.messages || []).map(mapMessage),
  lastMessage:     c.last_message,
  lastMessageTime: new Date(c.last_message_time),
  unreadCount:     c.unread_count,
});

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useChat = () => {
  const { user, isAuthenticated } = useAuth();
  const currentUserId = user?.id || "1";

  const [conversations,      setConversations]      = useState<Conversation[]>([]);
  const [activeConvId,       setActiveConvId]       = useState<string | null>(null);
  const [isTyping,           setIsTyping]           = useState<Record<string, boolean>>({});
  const [selectedMessages,   setSelectedMessages]   = useState<Set<string>>(new Set());
  const [activeQuizSession,  setActiveQuizSession]  = useState<QuizSession | null>(null);
  const [quizTimeRemaining,  setQuizTimeRemaining]  = useState(0);
  const [loadingConvs,       setLoadingConvs]       = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConvId);

  // ── Fetch conversations ─────────────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingConvs(true);
    try {
      const res = await fetch(`${API_BASE}/chat/conversations.php`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data: ApiConversation[] = await res.json();
      setConversations(data.map(mapConversation));
    } catch {
      // No fallback to mock data — show empty state
      setConversations([]);
    } finally {
      setLoadingConvs(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ── Fetch messages for a conversation ──────────────────────────────────────
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/chat/messages.php?conversation_id=${conversationId}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error();
      const data: ApiMessage[] = await res.json();
      setConversations(prev =>
        prev.map(c => c.id === conversationId
          ? { ...c, messages: data.map(mapMessage) }
          : c
        )
      );
    } catch {}
  }, []);

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (content: string, attachments?: Message["attachments"]) => {
      if (!activeConvId || (!content.trim() && !attachments?.length)) return;

      // Optimistic local message
      const tempId = `temp-${Date.now()}`;
      const newMsg: Message = {
        id:          tempId,
        senderId:    currentUserId,
        content:     content.trim(),
        timestamp:   new Date(),
        isRead:      true,
        attachments,
      };

      setConversations(prev =>
        prev.map(c => c.id === activeConvId
          ? {
              ...c,
              messages:        [...c.messages, newMsg],
              lastMessage:     content.trim() || "📎 Attachment",
              lastMessageTime: new Date(),
            }
          : c
        )
      );

      // Send to API
      try {
        const res = await fetch(`${API_BASE}/chat/send.php`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: activeConvId,
            content:         content.trim(),
            attachments:     attachments || [],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          // Replace temp message with real one from server
          if (data.message_id) {
            setConversations(prev =>
              prev.map(c => c.id === activeConvId
                ? {
                    ...c,
                    messages: c.messages.map(m =>
                      m.id === tempId ? { ...m, id: data.message_id } : m
                    ),
                  }
                : c
              )
            );
          }
        }
      } catch {}

      // Simulate typing indicator
      setIsTyping(prev => ({ ...prev, [activeConvId]: true }));
      setTimeout(() => {
        setIsTyping(prev => ({ ...prev, [activeConvId]: false }));
      }, 2000);
    },
    [activeConvId, currentUserId]
  );

  // ── Select conversation ─────────────────────────────────────────────────────
  const markAsRead = useCallback(async (conversationId: string) => {
    setConversations(prev =>
      prev.map(c => c.id === conversationId
        ? { ...c, unreadCount: 0, messages: c.messages.map(m => ({ ...m, isRead: true })) }
        : c
      )
    );
    try {
      await fetch(`${API_BASE}/chat/mark_read.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: conversationId }),
      });
    } catch {}
  }, []);

  const selectConversation = useCallback(async (id: string | null) => {
    setActiveConvId(id);
    setSelectedMessages(new Set());
    if (id) {
      await markAsRead(id);
      await fetchMessages(id);
    }
  }, [markAsRead, fetchMessages]);

  // Open (or create optimistically) a conversation with a given user
  const openConversationWithUser = useCallback((userId: string, userName: string, avatar?: string) => {
    let convId: string | null = null;
    setConversations(prev => {
      const existing = prev.find(c => c.user.id === userId);
      if (existing) {
        convId = existing.id;
        return prev;
      }
      const tempId = `temp-conv-${userId}`;
      convId = tempId;
      const stub: Conversation = {
        id: tempId,
        user: { id: userId, name: userName, avatar: avatar || "", isOnline: false },
        messages: [],
        lastMessage: "",
        lastMessageTime: new Date(),
        unreadCount: 0,
      };
      return [stub, ...prev];
    });
    if (convId) {
      setActiveConvId(convId);
      setSelectedMessages(new Set());
    }
  }, []);

  // ── Edit message ────────────────────────────────────────────────────────────
  const editMessage = useCallback(async (messageId: string, newContent: string) => {
    if (!activeConvId) return;
    setConversations(prev =>
      prev.map(c => c.id === activeConvId
        ? { ...c, messages: c.messages.map(m => m.id === messageId ? { ...m, content: newContent, isEdited: true } : m) }
        : c
      )
    );
    try {
      await fetch(`${API_BASE}/chat/edit_message.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: messageId, content: newContent }),
      });
    } catch {}
  }, [activeConvId]);

  // ── Delete message ──────────────────────────────────────────────────────────
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!activeConvId) return;
    setConversations(prev =>
      prev.map(c => c.id === activeConvId
        ? { ...c, messages: c.messages.filter(m => m.id !== messageId) }
        : c
      )
    );
    try {
      await fetch(`${API_BASE}/chat/delete_message.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: messageId }),
      });
    } catch {}
  }, [activeConvId]);

  const deleteSelectedMessages = useCallback(() => {
    if (!activeConvId) return;
    const ids = Array.from(selectedMessages);
    setConversations(prev =>
      prev.map(c => c.id === activeConvId
        ? { ...c, messages: c.messages.filter(m => !selectedMessages.has(m.id)) }
        : c
      )
    );
    setSelectedMessages(new Set());
    ids.forEach(id => {
      fetch(`${API_BASE}/chat/delete_message.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: id }),
      }).catch(() => {});
    });
  }, [activeConvId, selectedMessages]);

  // ── React to message ────────────────────────────────────────────────────────
  const reactToMessage = useCallback((messageId: string, emoji: string) => {
    if (!activeConvId) return;
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== activeConvId) return c;
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.id !== messageId) return m;
            const reactions = m.reactions || [];
            const existing  = reactions.find(r => r.userId === currentUserId);
            if (existing) {
              return existing.emoji === emoji
                ? { ...m, reactions: reactions.filter(r => r.userId !== currentUserId) }
                : { ...m, reactions: reactions.map(r => r.userId === currentUserId ? { ...r, emoji } : r) };
            }
            return { ...m, reactions: [...reactions, { userId: currentUserId, emoji }] };
          }),
        };
      })
    );
  }, [activeConvId, currentUserId]);

  // ── Select messages ─────────────────────────────────────────────────────────
  const toggleSelectMessage = useCallback((id: string) => {
    setSelectedMessages(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedMessages(new Set()), []);

  // ── Quiz ────────────────────────────────────────────────────────────────────
  const startQuizGame = useCallback(() => {
    if (!activeConvId) return;
    const questions = getRandomQuestions(10);
    setActiveQuizSession({
      id:                   `quiz-${Date.now()}`,
      conversationId:       activeConvId,
      questions,
      currentQuestionIndex: 0,
      score:                0,
      startedAt:            new Date(),
    });
    setQuizTimeRemaining(questions[0]?.timeLimit || 15);
  }, [activeConvId]);

  const answerQuizQuestion = useCallback((answerIndex: number) => {
    if (!activeQuizSession) return;
    const q        = activeQuizSession.questions[activeQuizSession.currentQuestionIndex];
    const correct  = answerIndex === q.correctAnswer;
    setActiveQuizSession(prev => {
      if (!prev) return null;
      const newScore = correct ? prev.score + q.points : prev.score;
      const nextIdx  = prev.currentQuestionIndex + 1;
      if (nextIdx >= prev.questions.length) return { ...prev, score: newScore, completedAt: new Date() };
      setQuizTimeRemaining(prev.questions[nextIdx].timeLimit);
      return { ...prev, score: newScore, currentQuestionIndex: nextIdx };
    });
  }, [activeQuizSession]);

  const exitQuizGame = useCallback(() => {
    setActiveQuizSession(null);
    setQuizTimeRemaining(0);
  }, []);

  return {
    conversations,
    activeConversation,
    activeConversationId: activeConvId,
    isTyping:             activeConvId ? isTyping[activeConvId] ?? false : false,
    selectedMessages,
    activeQuizSession,
    quizTimeRemaining,
    loadingConversations: loadingConvs,
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
    refetchConversations: fetchConversations,
  };
};
