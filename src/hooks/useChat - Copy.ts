/**
 * hooks/useChat.ts — Real API-backed chat hook
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { Message, Conversation } from "@/types/chat";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "/api";

function apiMsgToMessage(m: any): Message {
  return {
    id:          m.id,
    senderId:    m.senderId,
    content:     m.content || "",
    timestamp:   new Date(m.timestamp),
    isRead:      !!m.isRead,
    isEdited:    !!m.isEdited,
    replyToId:   m.replyToId || undefined,
    attachments: m.attachments ? m.attachments.filter(Boolean) : undefined,
    reactions:   m.reactions || [],
  };
}

function apiConvToConversation(d: any, existingMsgs: Message[] = []): Conversation {
  return {
    id:              d.id,
    user: {
      id:       d.user?.id       ?? "",
      name:     d.user?.name     ?? "Unknown",
      username: d.user?.username ?? "",
      avatar:   d.user?.avatar   ?? undefined,
      isOnline: !!d.user?.isOnline,
    },
    messages:        existingMsgs,
    lastMessage:     d.lastMessage     ?? "",
    lastMessageTime: d.lastMessageTime ? new Date(d.lastMessageTime) : new Date(0),
    unreadCount:     d.unreadCount     ?? 0,
  };
}

export const useChat = () => {
  const [conversations,        setConversations]        = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping,             setIsTyping]             = useState(false);
  const [selectedMessages,     setSelectedMessages]     = useState<Set<string>>(new Set());
  const [loadingConvs,         setLoadingConvs]         = useState(true);
  const [loadingMsgs,          setLoadingMsgs]          = useState(false);

  const lastMsgTime = useRef<Record<string, string>>({});
  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const convPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Track conversations created locally (not yet on server) so refresh doesn't delete them
  const localConvIds = useRef<Set<string>>(new Set());

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // ── Fetch conversation list ──────────────────────────────────────────────────
  const fetchConversations = useCallback(async (quiet = false) => {
    if (!quiet) setLoadingConvs(true);
    try {
      const res = await fetch(`${API_BASE}/chat/conversations.php`, { credentials: "include" });
      if (!res.ok) return;
      const data: any[] = await res.json();

      setConversations(prev => {
        // Build map of server conversations
        const serverMap = new Map(data.map(d => [d.id, d]));

        // Keep any local-only placeholder conversations that haven't arrived from server yet
        const localOnly = prev.filter(p =>
          localConvIds.current.has(p.id) && !serverMap.has(p.id)
        );

        // Merge server conversations, preserving existing messages
        const merged = data.map(d => {
          const existing = prev.find(p => p.id === d.id);
          // Once a local conversation is confirmed by server, remove from local set
          localConvIds.current.delete(d.id);
          return apiConvToConversation(d, existing?.messages ?? []);
        });

        return [...localOnly, ...merged];
      });
    } catch {}
    finally { if (!quiet) setLoadingConvs(false); }
  }, []);

  // ── Fetch messages ────────────────────────────────────────────────────────────
  const fetchMessages = useCallback(async (convId: string, sinceOnly = false) => {
    if (!convId) return;
    if (!sinceOnly) setLoadingMsgs(true);
    try {
      const since = sinceOnly && lastMsgTime.current[convId]
        ? `&since=${encodeURIComponent(lastMsgTime.current[convId])}`
        : "";
      const res = await fetch(
        `${API_BASE}/chat/messages.php?conversation_id=${convId}${since}`,
        { credentials: "include" }
      );
      if (!res.ok) return;
      const data: any[] = await res.json();
      if (!data.length && sinceOnly) return;

      const msgs = data.map(apiMsgToMessage);
      if (msgs.length) {
        lastMsgTime.current[convId] = msgs[msgs.length - 1].timestamp.toISOString();
      }

      setConversations(prev => prev.map(c => {
        if (c.id !== convId) return c;
        if (sinceOnly) {
          const existingIds = new Set(c.messages.map(m => m.id));
          const newMsgs = msgs.filter(m => !existingIds.has(m.id));
          if (!newMsgs.length) return c;
          const last = newMsgs[newMsgs.length - 1];
          return {
            ...c,
            messages:    [...c.messages, ...newMsgs],
            unreadCount: 0,
            lastMessage: last.content || '📎 Attachment',
          };
        }
        return { ...c, messages: msgs, unreadCount: 0 };
      }));
    } catch {}
    finally { if (!sinceOnly) setLoadingMsgs(false); }
  }, []);

  // ── Polling ───────────────────────────────────────────────────────────────────
  const startPolling = useCallback((convId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => fetchMessages(convId, true), 3000);
  }, [fetchMessages]);

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  // ── Initial load ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchConversations();
    convPollRef.current = setInterval(() => fetchConversations(true), 10000);
    return () => {
      if (convPollRef.current) clearInterval(convPollRef.current);
      stopPolling();
    };
  }, [fetchConversations, stopPolling]);

  // ── Select conversation ───────────────────────────────────────────────────────
  const selectConversation = useCallback(async (convId: string | null) => {
    stopPolling();
    setActiveConversationId(convId);
    setSelectedMessages(new Set());
    if (!convId) return;
    await fetchMessages(convId, false);
    startPolling(convId);
  }, [fetchMessages, startPolling, stopPolling]);

  // ── Start conversation with a user ───────────────────────────────────────────
  const startConversationWith = useCallback(async (
    otherUserId: string,
    otherUserName?: string
  ): Promise<string | null> => {
    try {
      // 1. Create/find conversation on server
      const res = await fetch(`${API_BASE}/chat/start.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ other_user_id: otherUserId }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      const convId: string = data.conversation_id;
      if (!convId) return null;

      // 2. Register as local so fetchConversations won't delete it before server confirms
      localConvIds.current.add(convId);

      // 3. Inject placeholder into state immediately
      setConversations(prev => {
        if (prev.find(c => c.id === convId)) return prev;
        const placeholder: Conversation = {
          id:              convId,
          user: {
            id:       otherUserId,
            name:     otherUserName || "...",
            username: "",
            avatar:   undefined,
            isOnline: false,
          },
          messages:        [],
          lastMessage:     "",
          lastMessageTime: new Date(),
          unreadCount:     0,
        };
        return [placeholder, ...prev];
      });

      // 4. Set active — chat panel opens immediately
      setActiveConversationId(convId);

      // 5. Load messages (shows loading spinner)
      await fetchMessages(convId, false);

      // 6. Start polling
      startPolling(convId);

      // 7. Refresh conversation list quietly in background to get real user data
      //    (this won't delete the placeholder because of localConvIds guard)
      fetchConversations(true);

      return convId;
    } catch (e) {
      console.error("[useChat] startConversationWith:", e);
      return null;
    }
  }, [fetchConversations, fetchMessages, startPolling]);

  // ── Send message ──────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (content: string, attachments?: Message["attachments"]) => {
    if (!activeConversationId) return;
    if (!content.trim() && !attachments?.length) return;

    const tempId = `temp-${Date.now()}`;
    const tempMsg: Message = {
      id: tempId, senderId: "me", content: content.trim(),
      timestamp: new Date(), isRead: true, attachments,
    };
    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, messages: [...c.messages, tempMsg],
            lastMessage: content.trim() || '📎 Attachment', lastMessageTime: new Date() }
        : c
    ));
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1500);
    try {
      await fetch(`${API_BASE}/chat/messages.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send", conversation_id: activeConversationId,
          content: content.trim(), attachments: attachments || [],
        }),
      });
      await fetchMessages(activeConversationId, false);
    } catch {}
  }, [activeConversationId, fetchMessages]);

  // ── Edit message ──────────────────────────────────────────────────────────────
  const editMessage = useCallback(async (messageId: string, newContent: string) => {
    if (!activeConversationId) return;
    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, messages: c.messages.map(m =>
            m.id === messageId ? { ...m, content: newContent, isEdited: true } : m) }
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

  // ── Delete message ────────────────────────────────────────────────────────────
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!activeConversationId) return;
    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, messages: c.messages.filter(m => m.id !== messageId) }
        : c
    ));
    try {
      await fetch(`${API_BASE}/chat/messages.php`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", message_id: messageId }),
      });
    } catch {}
  }, [activeConversationId]);

  // ── Delete selected ───────────────────────────────────────────────────────────
  const deleteSelectedMessages = useCallback(async () => {
    if (!activeConversationId) return;
    const ids = Array.from(selectedMessages);
    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, messages: c.messages.filter(m => !selectedMessages.has(m.id)) }
        : c
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

  // ── React to message ──────────────────────────────────────────────────────────
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
            ? { ...c, messages: c.messages.map(m =>
                m.id === messageId ? { ...m, reactions: d.reactions } : m) }
            : c
        ));
      }
    } catch {}
  }, [activeConversationId]);

  // ── Selection ─────────────────────────────────────────────────────────────────
  const toggleSelectMessage = useCallback((messageId: string) => {
    setSelectedMessages(prev => {
      const s = new Set(prev);
      s.has(messageId) ? s.delete(messageId) : s.add(messageId);
      return s;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedMessages(new Set()), []);

  const uploadFile = useCallback(async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(`${API_BASE}/chat/upload.php`, { method: "POST", credentials: "include", body: fd });
      const d = await res.json();
      return d.success ? { url: d.url as string, name: d.name as string, type: d.type as string } : null;
    } catch { return null; }
  }, []);

  const totalUnread = conversations.reduce((n, c) => n + c.unreadCount, 0);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    isTyping,
    selectedMessages,
    loadingConvs,
    loadingMsgs,
    totalUnread,
    sendMessage,
    selectConversation,
    startConversationWith,
    uploadFile,
    editMessage,
    deleteMessage,
    deleteSelectedMessages,
    reactToMessage,
    toggleSelectMessage,
    clearSelection,
    // Stubs for quiz (keeps MessagesSheet working)
    activeQuizSession:   null  as null,
    quizTimeRemaining:   0,
    startQuizGame:       (_conv?: unknown) => {},
    answerQuizQuestion:  (_i: number) => {},
    exitQuizGame:        () => {},
  };
};
