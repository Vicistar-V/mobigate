import { useState, useCallback, useEffect, useRef } from "react";
import { Message, Conversation, QuizSession } from "@/types/chat";
import { getRandomQuestions } from "@/data/quizData";

const API = "/api";

// ── type mappers ──────────────────────────────────────────────────────────────
const toMsg = (m: any): Message => ({
  id:          m.id,
  senderId:    m.senderId,
  content:     m.content ?? "",
  timestamp:   new Date(m.timestamp),
  isRead:      !!m.isRead,
  isEdited:    !!m.isEdited,
  replyToId:   m.replyToId,
  attachments: m.attachments?.filter(Boolean),
  reactions:   m.reactions ?? [],
});

const toConv = (d: any, msgs: Message[] = []): Conversation => ({
  id:              d.id,
  user: {
    id:       d.user.id,
    name:     d.user.name,
    avatar:   d.user.avatar,        // raw profile_photo from DB — same as comments
    isOnline: !!d.user.isOnline,
  },
  messages:        msgs,
  lastMessage:     d.lastMessage    ?? "",
  lastMessageTime: d.lastMessageTime ? new Date(d.lastMessageTime) : new Date(0),
  unreadCount:     d.unreadCount    ?? 0,
});

export const useChat = () => {
  const [conversations,    setConversations]    = useState<Conversation[]>([]);
  const [activeConvId,     setActiveConvId]     = useState<string | null>(null);
  const [isTypingMap,      setIsTypingMap]       = useState<Record<string, boolean>>({});
  const [selectedMsgs,     setSelectedMsgs]      = useState<Set<string>>(new Set());
  const [quizSession,      setQuizSession]       = useState<QuizSession | null>(null);
  const [quizTime,         setQuizTime]          = useState(0);
  const [loadingConvs,     setLoadingConvs]      = useState(false);
  const [loadingMsgs,      setLoadingMsgs]       = useState(false);

  const since     = useRef<Record<string, string>>({});
  const msgPoll   = useRef<ReturnType<typeof setInterval>>();
  const convPoll  = useRef<ReturnType<typeof setInterval>>();
  const localIds  = useRef<Set<string>>(new Set());

  const activeConversation = conversations.find(c => c.id === activeConvId);
  const isTyping   = activeConvId ? (isTypingMap[activeConvId] ?? false) : false;
  const totalUnread = conversations.reduce((n, c) => n + c.unreadCount, 0);

  // ── fetchConversations — no localStorage, always fresh ──────────────────────
  const fetchConversations = useCallback(async (quiet = false) => {
    if (!quiet) setLoadingConvs(true);
    try {
      const res = await fetch(`${API}/chat/conversations.php`, { credentials: "include" });
      if (!res.ok) return;
      const data: any[] = await res.json();
      if (!Array.isArray(data) || !data.length) return;
      setConversations(prev => {
        const ids = new Set(data.map((d: any) => d.id));
        const locals = prev.filter(p => localIds.current.has(p.id) && !ids.has(p.id));
        const merged = data.map((d: any) => {
          localIds.current.delete(d.id);
          const existing = prev.find(p => p.id === d.id);
          return toConv(d, existing?.messages ?? []);
        });
        return [...locals, ...merged];
      });
    } catch {}
    finally { if (!quiet) setLoadingConvs(false); }
  }, []);

  // ── fetchMessages ─────────────────────────────────────────────────────────────
  const fetchMessages = useCallback(async (convId: string, sinceOnly = false) => {
    if (!convId) return;
    if (!sinceOnly) setLoadingMsgs(true);
    try {
      const q = sinceOnly && since.current[convId]
        ? `&since=${encodeURIComponent(since.current[convId])}` : "";
      const res = await fetch(`${API}/chat/messages.php?conversation_id=${convId}${q}`, { credentials: "include" });
      if (!res.ok) return;
      const data: any[] = await res.json();
      if (!Array.isArray(data) || (!data.length && sinceOnly)) return;
      const msgs = data.map(toMsg);
      if (msgs.length) since.current[convId] = msgs[msgs.length - 1].timestamp.toISOString();
      setConversations(prev => prev.map(c => {
        if (c.id !== convId) return c;
        if (sinceOnly) {
          const seen = new Set(c.messages.map(m => m.id));
          const news = msgs.filter(m => !seen.has(m.id));
          return news.length ? { ...c, messages: [...c.messages, ...news], unreadCount: 0 } : c;
        }
        return { ...c, messages: msgs, unreadCount: 0 };
      }));
    } catch {}
    finally { if (!sinceOnly) setLoadingMsgs(false); }
  }, []);

  // ── polling ───────────────────────────────────────────────────────────────────
  const startPoll = useCallback((id: string) => {
    if (msgPoll.current) clearInterval(msgPoll.current);
    msgPoll.current = setInterval(() => fetchMessages(id, true), 3000);
  }, [fetchMessages]);
  const stopPoll = useCallback(() => {
    if (msgPoll.current) { clearInterval(msgPoll.current); msgPoll.current = undefined; }
  }, []);

  useEffect(() => {
    fetchConversations();
    convPoll.current = setInterval(() => fetchConversations(true), 10000);
    return () => {
      if (convPoll.current) clearInterval(convPoll.current);
      stopPoll();
    };
  }, [fetchConversations, stopPoll]);

  // ── selectConversation ────────────────────────────────────────────────────────
  const selectConversation = useCallback(async (id: string | null) => {
    stopPoll();
    setActiveConvId(id);
    setSelectedMsgs(new Set());
    if (!id) return;
    await fetchMessages(id, false);
    startPoll(id);
  }, [fetchMessages, startPoll, stopPoll]);

  // ── startConversationWith ─────────────────────────────────────────────────────
  const startConversationWith = useCallback(async (otherId: string, otherName?: string, otherAvatar?: string) => {
    // Optimistic local fallback — always opens a chat thread immediately,
    // even when the backend cannot resolve the user (e.g. demo/placeholder IDs).
    const openLocal = () => {
      const localId = `local-${otherId}`;
      localIds.current.add(localId);
      setConversations(prev => {
        if (prev.find(c => c.id === localId)) return prev;
        return [toConv({ id: localId, user: { id: otherId, name: otherName || "User", avatar: otherAvatar || null, isOnline: false }, lastMessage: "", lastMessageTime: null, unreadCount: 0 }), ...prev];
      });
      setActiveConvId(localId);
      return localId;
    };
    try {
      const res = await fetch(`${API}/chat/start.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ other_user_id: otherId }),
      });
      if (!res.ok) return openLocal();
      const { conversation_id: convId } = await res.json();
      if (!convId) return openLocal();
      localIds.current.add(convId);
      setConversations(prev => {
        if (prev.find(c => c.id === convId)) return prev;
        return [toConv({ id: convId, user: { id: otherId, name: otherName || "...", avatar: otherAvatar || null, isOnline: false }, lastMessage: "", lastMessageTime: null, unreadCount: 0 }), ...prev];
      });
      setActiveConvId(convId);
      await fetchMessages(convId, false);
      startPoll(convId);
      fetchConversations(true); // get real avatar in background
      return convId;
    } catch { return openLocal(); }
  }, [fetchConversations, fetchMessages, startPoll]);

  // ── sendMessage ───────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (content: string, attachments?: Message["attachments"]) => {
    if (!activeConvId || (!content.trim() && !attachments?.length)) return;
    const tempId = `temp-${Date.now()}`;
    setConversations(prev => prev.map(c => c.id === activeConvId
      ? { ...c, messages: [...c.messages, { id: tempId, senderId: "me", content: content.trim(), timestamp: new Date(), isRead: true, attachments } as Message],
          lastMessage: content.trim() || "📎", lastMessageTime: new Date() }
      : c
    ));
    setIsTypingMap(p => ({ ...p, [activeConvId]: true }));
    setTimeout(() => setIsTypingMap(p => ({ ...p, [activeConvId]: false })), 1500);
    const cid = activeConvId;
    try {
      await fetch(`${API}/chat/messages.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", conversation_id: cid, content: content.trim(), attachments: attachments || [] }),
      });
      await fetchMessages(cid, true);
      setConversations(prev => prev.map(c => c.id === cid
        ? { ...c, messages: c.messages.filter(m => m.id !== tempId) } : c
      ));
    } catch {}
  }, [activeConvId, fetchMessages]);

  // ── edit / delete / react ────────────────────────────────────────────────────
  const editMessage = useCallback(async (msgId: string, text: string) => {
    if (!activeConvId) return;
    setConversations(prev => prev.map(c => c.id === activeConvId
      ? { ...c, messages: c.messages.map(m => m.id === msgId ? { ...m, content: text, isEdited: true } : m) } : c
    ));
    await fetch(`${API}/chat/messages.php`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "edit", message_id: msgId, content: text }) }).catch(() => {});
  }, [activeConvId]);

  const deleteMessage = useCallback(async (msgId: string) => {
    if (!activeConvId) return;
    setConversations(prev => prev.map(c => c.id === activeConvId
      ? { ...c, messages: c.messages.filter(m => m.id !== msgId) } : c
    ));
    await fetch(`${API}/chat/messages.php`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", message_id: msgId }) }).catch(() => {});
  }, [activeConvId]);

  const deleteSelectedMessages = useCallback(async () => {
    if (!activeConvId) return;
    const ids = Array.from(selectedMsgs);
    setConversations(prev => prev.map(c => c.id === activeConvId
      ? { ...c, messages: c.messages.filter(m => !selectedMsgs.has(m.id)) } : c
    ));
    setSelectedMsgs(new Set());
    for (const id of ids)
      await fetch(`${API}/chat/messages.php`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", message_id: id }) }).catch(() => {});
  }, [activeConvId, selectedMsgs]);

  const reactToMessage = useCallback(async (msgId: string, emoji: string) => {
    const res = await fetch(`${API}/chat/messages.php`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "react", message_id: msgId, emoji }) }).catch(() => null);
    if (!res?.ok || !activeConvId) return;
    const d = await res.json();
    if (d.reactions) setConversations(prev => prev.map(c => c.id === activeConvId
      ? { ...c, messages: c.messages.map(m => m.id === msgId ? { ...m, reactions: d.reactions } : m) } : c
    ));
  }, [activeConvId]);

  const toggleSelectMessage = useCallback((id: string) => {
    setSelectedMsgs(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }, []);
  const clearSelection = useCallback(() => setSelectedMsgs(new Set()), []);

  // ── quiz ──────────────────────────────────────────────────────────────────────
  const startQuizGame = useCallback(() => {
    if (!activeConvId) return;
    const qs = getRandomQuestions(10);
    setQuizSession({ id: `quiz-${Date.now()}`, conversationId: activeConvId, questions: qs, currentQuestionIndex: 0, score: 0, startedAt: new Date() });
    setQuizTime(qs[0]?.timeLimit || 15);
  }, [activeConvId]);

  const answerQuizQuestion = useCallback((i: number) => {
    if (!quizSession) return;
    const q = quizSession.questions[quizSession.currentQuestionIndex];
    const correct = i === q.correctAnswer;
    setQuizSession(prev => {
      if (!prev) return null;
      const score = correct ? prev.score + q.points : prev.score;
      const next  = prev.currentQuestionIndex + 1;
      if (next >= prev.questions.length) return { ...prev, score, completedAt: new Date() };
      setQuizTime(prev.questions[next].timeLimit);
      return { ...prev, score, currentQuestionIndex: next };
    });
  }, [quizSession]);

  const exitQuizGame = useCallback(() => { setQuizSession(null); setQuizTime(0); }, []);

  return {
    conversations, activeConversation, activeConversationId: activeConvId,
    isTyping, selectedMessages: selectedMsgs, activeQuizSession: quizSession,
    quizTimeRemaining: quizTime, totalUnread, loadingConvs, loadingMsgs,
    fetchConversations, sendMessage, selectConversation, startConversationWith,
    editMessage, deleteMessage, deleteSelectedMessages, reactToMessage,
    toggleSelectMessage, clearSelection, startQuizGame, answerQuizQuestion, exitQuizGame,
  };
};
