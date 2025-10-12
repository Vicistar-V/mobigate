import { useState, useCallback } from "react";
import { Message, Conversation } from "@/types/chat";
import { mockConversations } from "@/data/chatData";

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<{ [key: string]: boolean }>({});

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  const sendMessage = useCallback(
    (content: string, attachments?: Message["attachments"]) => {
      if (!activeConversationId || !content.trim()) return;

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
              lastMessage: content.trim(),
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

  const selectConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
    markAsRead(conversationId);
  }, [markAsRead]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    isTyping: activeConversationId ? isTyping[activeConversationId] : false,
    sendMessage,
    selectConversation,
  };
};
