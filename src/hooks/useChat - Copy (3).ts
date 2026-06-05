import { useState, useCallback, useEffect, useRef } from "react";
import { Message, Conversation, QuizSession } from "@/types/chat";
import { getRandomQuestions } from "@/data/quizData";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

function apiMsgToMessage(m: any): Message {
  return {
    id: m.id, senderId: m.senderId, content: m.content || "",
    timestamp: new Date(m.timestamp), isRead: !!m.isRead, isEdited: !!m.isEdited,
    replyToId: m.replyToId || undefined,
    attachments: m.attachments?.filter(Boolean) || undefined,
    reactions: m.reactions || [],
  };
}

// Mirror exactly how posts handle author_profile_photo: use the raw value, no manipulation
function apiConvToConv(d: any, msgs: Message[] = []): Conversation {
  return {
    id: d.id,
    user: {
      id: d.user?.id ?? "",
      name: d.user?.name ?? "Unknown",
      avatar: d.user?.avatar || undefined,  // raw full URL from server, same as author_profile_photo
      isOnline: !!d.user?.isOnline,
    },
    messages: msgs,
    lastMessage: d.lastMessage ?? "",
    lastMessageTime: d.lastMessageTime ? new Date(d.lastMessageTime) : new Date(0),
    unreadCount: d.unreadCount ?? 0,
  };
}

export const useChat = () => {
  const { user } = useAuth();
  const currentUserId = user?.id ?? "";

  const [conversations,        setConversations]        = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTypingMap,          setIsTypingMap]          = useState<Record<string, boolean>>({});
  const [selectedMessages,     setSelectedMessages]     = useState<Set<string>>(new Set());
  const [activeQuizSession,    setActiveQuizSession]    = useState<QuizSession | null>(null);
  const [quizTimeRemaining,    setQuizTimeRemaining]    = useState<number>(0);
  const [loadingConvs,         setLoadingConvs]         = useState(true);
  const [loadingMsgs,          setLoadingMsgs]          = useState(false);

  const lastMsgTime  = useRef<Record<string, string>>({});
  const pollRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const convPollRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const localConvIds = useRef<Set<string>>(new Set());

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const isTyping = activeConversationId ? (isTypingMap[activeConversationId] ?? false) : false;
  const totalUnread = conversations.reduce((n, c) => n + c.unreadCount, 0);

  // ── fetchConversations ────────────────────────────────────────────────────────
  const fetchConversations = useCallback(async (quiet = false, retries = 3) => {
    if (!quiet) setLoadingConvs(true);
    try {
      const res = await fetch(`${API_BASE}/chat/conversations.php`, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401 && retries > 0) {
          setTimeout(() => fetchConversations(quiet, retries - 1), 1500);
          return;
        }
        return;
      }
      const data: any[] = await res.json();
      if (!Array.isArray(data)) return;
      if (data.length > 0) console.log('[useChat] avatar from server:', data[0]?.user?.avatar);
      // Always replace with fresh server data — server is source of truth (like posts)
      setConversations(prev => {
        const merged = data.map((d: any) => {
          const existing = prev.find(p => p.id === d.id);
          localConvIds.current.delete(d.id);
          return apiConvToConv(d, existing?.messages ?? []);
        });
        // keep local placeholders not yet on server
        const serverIds = new Set(data.map((d: any) => d.id));
        const localOnly = prev.filter(p => localConvIds.current.has(p.id) && !serverIds.has(p.id));
        return [...localOnly, ...merged];
      });
    } catch {}
    finally { if (!quiet) setLoadingConvs(false); }
  }, []);

  // ── fetchMessages ─────────────────────────────────────────────────────────────
  const fetchMessages = useCallback(async (convId: string, sinceOnly = false) => {
    if (!convId) return;
    if (!sinceOnly) setLoadingMsgs(true);
    try {
      const since = sinceOnly && lastMsgTime.current[convId]
        ? `&since=${encodeURIComponent(lastMsgTime.current[convId])}` : "";
      const res = await fetch(`${API_BASE}/chat/messages.php?conversation_id=${convId}${since}`, { credentials: "include" });
      if (!res.ok) return;
      const data: any[] = await res.json();
      if (!Array.isArray(data)) return;
      if (data.length === 0 && sinceOnly) return;
      const msgs = data.map(apiMsgToMessage);
      if (msgs.length) lastMsgTime.current[convId] = msgs[msgs.length - 1].timestamp.toISOString();
      setConversations(prev => prev.map(c => {
        if (c.id !== convId) return c;
        if (sinceOnly) {
          const ids = new Set(c.messages.map(m => m.id));
          const newMsgs = msgs.filter(m => !ids.has(m.id));
          if (!newMsgs.length) return c;
          return { ...c, messages: [...c.messages, ...newMsgs], unreadCount: 0 };
        }
        return { ...c, messages: msgs, unreadCount: 0 };
      }));
    } catch {}
    finally { if (!sinceOnly) setLoadingMsgs(false); }
  }, []);

  const startPolling = useCallback((convId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => fetchMessages(convId, true), 3000);
  }, [fetchMessages]);

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  useEffect(() => {
    fetchConversations();
    convPollRef.current = setInterval(() => fetchConversations(true), 10000);
    return () => {
      if (convPollRef.current) clearInterval(convPollRef.current);
      stopPolling();
    };
  }, [fetchConversations, stopPolling]);

  const selectConversation = useCallback(async (convId: string | null) => {
    stopPolling();
    setActiveConversationId(convId);
    setSelectedMessages(new Set());
    if (!convId) return;
    await fetchMessages(convId, false);
    startPolling(convId);
  }, [fetchMessages, startPolling, stopPolling]);

  const startConversationWith = useCallback(async (otherUserId: string, otherUserName?: string) => {
    try {
      const res = await fetch(`${API_BASE}/chat/start.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ other_user_id: otherUserId }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      const convId: string = data.conversation_id;
      if (!convId) return null;
      localConvIds.current.add(convId);
      setConversations(prev => {
        if (prev.find(c => c.id === convId)) return prev;
        return [apiConvToConv({
          id: convId,
          user: { id: otherUserId, name: otherUserName || "...", avatar: undefined, isOnline: false },
          lastMessage: "", lastMessageTime: new Date().toISOString(), unreadCount: 0,
        }), ...prev];
      });
      setActiveConversationId(convId);
      await fetchMessages(convId, false);
      startPolling(convId);
      fetchConversations(true);  // refresh to get real avatar
      return convId;
    } catch { return null; }
  }, [fetchConversations, fetchMessages, startPolling]);

  const sendMessage = useCallback(async (content: string, attachments?: Message["attachments"]) => {
    if (!activeConversationId) return;
    if (!content.trim() && !attachments?.length) return;
    const tempId = `temp-${Date.now()}`;
    const tempMsg: Message = { id: tempId, senderId: "me", content: content.trim(), timestamp: new Date(), isRead: true, attachments };
    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, messages: [...c.messages, tempMsg], lastMessage: content.trim() || "📎", lastMessageTime: new Date() }
        : c
    ));
    setIsTypingMap(p => ({ ...p, [activeConversationId]: true }));
    setTimeout(() => setIsTypingMap(p => ({ ...p, [activeConversationId]: false })), 1500);
    const convId = activeConversationId;
    try {
      await fetch(`${API_BASE}/chat/messages.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", conversation_id: convId, content: content.trim(), attachments: attachments || [] }),
      });
      await fetchMessages(convId, true);
      setConversations(prev => prev.map(c =>
        c.id === convId ? { ...c, messages: c.messages.filter(m => m.id !== tempId) } : c
      ));
    } catch {}
  }, [activeConversationId, fetchMessages]);

  const editMessage = useCallback(async (messageId: string, newContent: string) => {
    if (!activeConversationId) return;
    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, messages: c.messages.map(m => m.id === messageId ? { ...m, content: newContent, isEdited: true } : m) }
        : c
    ));
    try {
      await fetch(`${API_BASE}/chat/messages.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit", message_id: messageId, content: newContent }),
      });
    } catch {}
  }, [activeConversationId]);

  const deleteMessage = useCallback(async (messageId: string) => {
    if (!activeConversationId) return;
    setConversations(prev => prev.map(c =>
      c.id === activeConversationId ? { ...c, messages: c.messages.filter(m => m.id !== messageId) } : c
    ));
    try {
      await fetch(`${API_BASE}/chat/messages.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", message_id: messageId }),
      });
    } catch {}
  }, [activeConversationId]);

  const deleteSelectedMessages = useCallback(async () => {
    if (!activeConversationId) return;
    const ids = Array.from(selectedMessages);
    setConversations(prev => prev.map(c =>
      c.id === activeConversationId ? { ...c, messages: c.messages.filter(m => !selectedMessages.has(m.id)) } : c
    ));
    setSelectedMessages(new Set());
    for (const id of ids) {
      try {
        await fetch(`${API_BASE}/chat/messages.php`, {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "delete", message_id: id }),
        });
      } catch {}
    }
  }, [activeConversationId, selectedMessages]);

  const reactToMessage = useCallback(async (messageId: string, emoji: string) => {
    try {
      const res = await fetch(`${API_BASE}/chat/messages.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "react", message_id: messageId, emoji }),
      });
      const d = await res.json();
      if (d.reactions && activeConversationId) {
        setConversations(prev => prev.map(c =>
          c.id === activeConversationId
            ? { ...c, messages: c.messages.map(m => m.id === messageId ? { ...m, reactions: d.reactions } : m) }
            : c
        ));
      }
    } catch {}
  }, [activeConversationId]);

  const toggleSelectMessage = useCallback((messageId: string) => {
    setSelectedMessages(prev => { const s = new Set(prev); s.has(messageId) ? s.delete(messageId) : s.add(messageId); return s; });
  }, []);
  const clearSelection = useCallback(() => setSelectedMessages(new Set()), []);

  const startQuizGame = useCallback(() => {
    if (!activeConversationId) return;
    const questions = getRandomQuestions(10);
    setActiveQuizSession({ id: `quiz-${Date.now()}`, conversationId: activeConversationId, questions, currentQuestionIndex: 0, score: 0, startedAt: new Date() });
    setQuizTimeRemaining(questions[0]?.timeLimit || 15);
  }, [activeConversationId]);

  const answerQuizQuestion = useCallback((answerIndex: number) => {
    if (!activeQuizSession) return;
    const q = activeQuizSession.questions[activeQuizSession.currentQuestionIndex];
    const isCorrect = answerIndex === q.correctAnswer;
    setActiveQuizSession(prev => {
      if (!prev) return null;
      const score = isCorrect ? prev.score + q.points : prev.score;
      const next = prev.currentQuestionIndex + 1;
      if (next >= prev.questions.length) return { ...prev, score, completedAt: new Date() };
      setQuizTimeRemaining(prev.questions[next].timeLimit);
      return { ...prev, score, currentQuestionIndex: next };
    });
  }, [activeQuizSession]);

  const exitQuizGame = useCallback(() => { setActiveQuizSession(null); setQuizTimeRemaining(0); }, []);

  return {
    conversations, activeConversation, activeConversationId,
    isTyping, selectedMessages, activeQuizSession, quizTimeRemaining,
    totalUnread, loadingConvs, loadingMsgs,
    sendMessage, selectConversation, startConversationWith, fetchConversations,
    editMessage, deleteMessage, deleteSelectedMessages,
    reactToMessage, toggleSelectMessage, clearSelection,
    startQuizGame, answerQuizQuestion, exitQuizGame,
  };
};