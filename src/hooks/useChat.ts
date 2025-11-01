import { useState, useCallback } from "react";
import { Message, Conversation, QuizSession, QuizQuestion } from "@/types/chat";
import { mockConversations } from "@/data/chatData";
import { getRandomQuestions } from "@/data/quizData";
import { useCurrentUserId } from "@/hooks/useWindowData";

export const useChat = () => {
  const currentUserId = useCurrentUserId();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<{ [key: string]: boolean }>({});
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [activeQuizSession, setActiveQuizSession] = useState<QuizSession | null>(null);
  const [quizTimeRemaining, setQuizTimeRemaining] = useState<number>(0);

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  const sendMessage = useCallback(
    (content: string, attachments?: Message["attachments"]) => {
      if (!activeConversationId || (!content.trim() && !attachments?.length)) return;

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUserId,
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
        
        const mockResponses = [
          "Thanks for your message! I'll get back to you soon.",
          "Got it! Let me check on that for you.",
          "That sounds interesting! Tell me more.",
          "I appreciate you reaching out. I'll respond shortly.",
          "Perfect timing! I was just thinking about this.",
          "Great question! Let me look into that.",
          "I completely understand what you mean.",
          "That's a good point. Let me consider it.",
          "Thanks for sharing that with me!",
          "I see what you're saying. Give me a moment.",
          "Absolutely! I'll get right on that.",
          "That makes sense. Let me think about it.",
          "I'm glad you brought this up!",
          "Thanks for the update! I'll review it.",
          "I really appreciate your patience.",
          "That's helpful information, thank you!",
          "I'll look into this and get back to you.",
          "Good to hear from you! I'll respond soon.",
          "Thanks for letting me know!",
          "I'm on it! Give me just a moment.",
          "That's really interesting! I'd love to hear more.",
          "I understand. Let me work on this.",
          "Perfect! I'll check that out.",
          "Thanks for the heads up!",
          "I appreciate you thinking of me.",
          "That's great news! Thanks for sharing.",
          "I'll get back to you with more details soon.",
          "Thanks for keeping me posted!",
          "I'm excited to hear about this!",
          "That sounds like a plan. Let me confirm.",
          "I'll make sure to follow up on that.",
          "Thanks for your help with this!",
          "I really appreciate your input.",
          "That's exactly what I was looking for!",
          "Perfect! That works for me.",
          "I'll get that sorted out for you.",
          "Thanks for clarifying that!",
          "I understand completely. Let me handle it.",
          "That's a smart idea! Let's do it.",
          "I'll take care of that right away.",
          "Thanks for the reminder!",
          "I'm glad we're on the same page.",
          "That's very helpful, thank you!",
          "I'll look into the details and respond.",
          "Thanks for bringing this to my attention.",
          "I appreciate you checking in!",
          "That's good to know. Thanks!",
          "I'll make sure to get back to you soon.",
          "Thanks for your understanding!",
          "I'm working on it as we speak.",
          "That's a great suggestion!",
          "I'll review this and let you know.",
          "Thanks for the information!",
          "I see what you mean. Let me verify.",
          "That's wonderful! Thanks for sharing.",
          "I'll get back to you with an answer.",
          "Thanks for reaching out to me!",
          "I really value your feedback.",
          "That's helpful context. Thank you!",
          "I'm on the same wavelength!",
          "I'll take a look and respond shortly.",
          "Thanks for your cooperation!",
          "That makes perfect sense to me.",
          "I appreciate you taking the time.",
          "I'll sort this out and update you.",
          "Thanks for your patience with this!",
          "That's a fair point. Let me think.",
          "I'm happy to help with that!",
          "I'll get back to you as soon as possible.",
          "Thanks for being so responsive!",
          "That's exactly right! Good catch.",
          "I'll confirm the details and respond.",
          "Thanks for your quick response!",
          "I understand your concern. Let me help.",
          "That sounds like a good approach.",
          "I'll work on this and keep you updated.",
          "Thanks for your support!",
          "That's really useful information!",
          "I'll make that a priority.",
          "Thanks for your continued patience!",
          "I'm excited to work on this with you.",
          "That's a valid concern. Let me address it.",
          "I'll review the situation and respond.",
          "Thanks for your collaboration!",
          "That's a great observation!",
          "I'll get this resolved for you.",
          "Thanks for keeping things moving!",
          "I understand the urgency. I'm on it!",
          "That's really thoughtful of you.",
          "I'll make sure this gets done.",
          "Thanks for your flexibility!",
          "That's an interesting perspective!",
          "I'll coordinate with the team and update you.",
          "Thanks for being so understanding!",
          "That's exactly what we need.",
          "I'll prioritize this and get back to you.",
          "Thanks for your professionalism!",
          "I appreciate your detailed explanation.",
          "That's really encouraging! Thank you.",
          "I'll follow up with you shortly.",
          "Thanks for your trust in me!"
        ];
        
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        
        const autoReply: Message = {
          id: `msg-${Date.now() + 1}`,
          senderId: activeConversation?.user.id || "",
          content: randomResponse,
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
                const existingReaction = reactions.find(r => r.userId === currentUserId);
                
                if (existingReaction) {
                  if (existingReaction.emoji === emoji) {
                    return {
                      ...msg,
                      reactions: reactions.filter(r => r.userId !== currentUserId),
                    };
                  } else {
                    return {
                      ...msg,
                      reactions: reactions.map(r =>
                        r.userId === currentUserId ? { ...r, emoji } : r
                      ),
                    };
                  }
                } else {
                  return {
                    ...msg,
                    reactions: [...reactions, { userId: currentUserId, emoji }],
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

  const startQuizGame = useCallback(() => {
    if (!activeConversationId) return;
    
    const questions = getRandomQuestions(10);
    const newSession: QuizSession = {
      id: `quiz-${Date.now()}`,
      conversationId: activeConversationId,
      questions,
      currentQuestionIndex: 0,
      score: 0,
      startedAt: new Date(),
    };
    
    setActiveQuizSession(newSession);
    setQuizTimeRemaining(questions[0]?.timeLimit || 15);
  }, [activeConversationId]);

  const answerQuizQuestion = useCallback((answerIndex: number) => {
    if (!activeQuizSession) return;
    
    const currentQuestion = activeQuizSession.questions[activeQuizSession.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    setActiveQuizSession((prev) => {
      if (!prev) return null;
      
      const newScore = isCorrect ? prev.score + currentQuestion.points : prev.score;
      const nextIndex = prev.currentQuestionIndex + 1;
      
      if (nextIndex >= prev.questions.length) {
        // Quiz completed
        return {
          ...prev,
          score: newScore,
          completedAt: new Date(),
        };
      }
      
      // Move to next question
      const nextQuestion = prev.questions[nextIndex];
      setQuizTimeRemaining(nextQuestion.timeLimit);
      
      return {
        ...prev,
        score: newScore,
        currentQuestionIndex: nextIndex,
      };
    });
  }, [activeQuizSession]);

  const exitQuizGame = useCallback(() => {
    setActiveQuizSession(null);
    setQuizTimeRemaining(0);
  }, []);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    isTyping: activeConversationId ? isTyping[activeConversationId] : false,
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
  };
};
