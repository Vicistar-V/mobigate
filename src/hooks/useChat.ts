import { useState, useCallback } from "react";
import { Message, Conversation } from "@/types/chat";
import { mockConversations } from "@/data/chatData";

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<{ [key: string]: boolean }>({});
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  const sendMessage = useCallback(
    (content: string, attachments?: Message["attachments"]) => {
      if (!activeConversationId || (!content.trim() && !attachments?.length)) return;

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: "current-user",
        content: content.trim(),
        timestamp: new Date(),
        isRead: true,
        attachments,
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: content.trim() || (attachments?.[0]?.type === 'image' ? '📷 Photo' : '📎 File'),
              lastMessageTime: new Date(),
            };
          }
          return conv;
        })
      );

      // Simulate typing indicator and auto-reply
      setIsTyping((prev) => ({ ...prev, [activeConversationId]: true }));
      
      setTimeout(() => {
        setIsTyping((prev) => ({ ...prev, [activeConversationId]: false }));
        
        const autoReply: Message = {
          id: `msg-${Date.now() + 1}`,
          senderId: activeConversation?.user.id || "",
          content: "Thanks for your message! I'll get back to you soon.",
          timestamp: new Date(),
          isRead: false,
        };

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === activeConversationId) {
              return {
                ...conv,
                messages: [...conv.messages, autoReply],
                lastMessage: autoReply.content,
                lastMessageTime: new Date(),
                unreadCount: conv.unreadCount + 1,
              };
            }
            return conv;
          })
        );
      }, 2000);
    },
    [activeConversationId, activeConversation]
  );

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map((msg) => ({ ...msg, isRead: true })),
          };
        }
        return conv;
      })
    );
  }, []);

  const selectConversation = useCallback((conversationId: string | null) => {
    setActiveConversationId(conversationId);
    setSelectedMessages(new Set());
    if (conversationId) {
      markAsRead(conversationId);
    }
  }, [markAsRead]);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    if (!activeConversationId) return;
    
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: conv.messages.map((msg) =>
              msg.id === messageId
                ? { ...msg, content: newContent, isEdited: true }
                : msg
            ),
          };
        }
        return conv;
      })
    );
  }, [activeConversationId]);

  const deleteMessage = useCallback((messageId: string) => {
    if (!activeConversationId) return;
    
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: conv.messages.filter((msg) => msg.id !== messageId),
          };
        }
        return conv;
      })
    );
  }, [activeConversationId]);

  const deleteSelectedMessages = useCallback(() => {
    if (!activeConversationId) return;
    
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: conv.messages.filter((msg) => !selectedMessages.has(msg.id)),
          };
        }
        return conv;
      })
    );
    setSelectedMessages(new Set());
  }, [activeConversationId, selectedMessages]);

  const reactToMessage = useCallback((messageId: string, emoji: string) => {
    if (!activeConversationId) return;
    
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: conv.messages.map((msg) => {
              if (msg.id === messageId) {
                const reactions = msg.reactions || [];
                const existingReaction = reactions.find(r => r.userId === "current-user");
                
                if (existingReaction) {
                  if (existingReaction.emoji === emoji) {
                    return {
                      ...msg,
                      reactions: reactions.filter(r => r.userId !== "current-user"),
                    };
                  } else {
                    return {
                      ...msg,
                      reactions: reactions.map(r =>
                        r.userId === "current-user" ? { ...r, emoji } : r
                      ),
                    };
                  }
                } else {
                  return {
                    ...msg,
                    reactions: [...reactions, { userId: "current-user", emoji }],
                  };
                }
              }
              return msg;
            }),
          };
        }
        return conv;
      })
    );
  }, [activeConversationId]);

  const toggleSelectMessage = useCallback((messageId: string) => {
    setSelectedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedMessages(new Set());
  }, []);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    isTyping: activeConversationId ? isTyping[activeConversationId] : false,
    selectedMessages,
    sendMessage,
    selectConversation,
    editMessage,
    deleteMessage,
    deleteSelectedMessages,
    reactToMessage,
    toggleSelectMessage,
    clearSelection,
  };
};
